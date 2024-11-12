// utils/cloudinary.js
import cloudinary from "cloudinary";
import { createError } from "./error.js";

// Configure cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadThumbnail = async (file) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "cake-academy/courses/thumbnails",
            width: 1280,
            height: 720,
            crop: "fill",
            quality: "auto",
            fetch_format: "auto",
            resource_type: "image",
            transformation: [
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        throw createError(500, "Error uploading thumbnail to Cloudinary");
    }
};

export const uploadVideo = async (file, courseId, lectureNumber) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: `cake-academy/courses/${courseId}/lectures`,
            resource_type: "video",
            chunk_size: 6000000, // 6MB chunks for reliable uploads
            filename_override: `lecture-${lectureNumber}`,
            eager: [
                // Adaptive streaming profiles
                { streaming_profile: "full_hd", format: "m3u8" },
                { streaming_profile: "hd", format: "m3u8" }
            ],
            eager_async: true,
            eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL, // Optional: for status updates
            tags: ["course_lecture", courseId],
            context: {
                course_id: courseId,
                lecture_number: lectureNumber
            }
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration,
            format: result.format,
            bytes: result.bytes,
            // For adaptive streaming
            playbackUrl: result.eager && result.eager[0] ? result.eager[0].secure_url : result.secure_url
        };
    } catch (error) {
        throw createError(500, "Error uploading video to Cloudinary");
    }
};