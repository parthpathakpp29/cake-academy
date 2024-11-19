import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const lectureSchema = z.object({
    id: z.number(),
    title: z.string()
        .min(3, 'Lecture title must be at least 3 characters')
        .max(100, 'Lecture title cannot exceed 100 characters'),
    video: z.any()
        .refine((file) => file !== null, 'Video is required')
        .refine(
            (file) => {
                if (file instanceof File) {
                    return ['video/mp4', 'video/webm', 'video/ogg'].includes(file.type);
                }
                return true;
            },
            'Only .mp4, .webm, and .ogg video formats are allowed'
        )
        .optional()
        .nullable(),
});

// Main course creation schema
export const courseSchema = z.object({
    // Landing Page Section
    thumbnail: z.any()
        .refine((file) => file !== null, 'Course thumbnail is required')
        .refine(
            (file) => {
                if (file instanceof File) {
                    return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
                }
                return true;
            },
            'Only .jpg, .png, and .webp image formats are allowed'
        ),
    title: z.string()
        .min(5, 'Course title must be at least 5 characters')
        .max(100, 'Course title cannot exceed 100 characters'),
    description: z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description cannot exceed 2000 characters'),
    price: z.number()
        .min(0, 'Price cannot be negative')
        .max(999999.99, 'Price cannot exceed 999,999.99')
        .transform((val) => Number(val.toFixed(2))), // Ensures 2 decimal places

    // Curriculum Section
    lectures: z.array(lectureSchema)
        .min(1, 'Course must have at least one lecture')
        .max(50, 'Course cannot have more than 50 lectures'),
});