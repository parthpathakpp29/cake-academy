import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    async signUp(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Sign up failed');
        }
    },

    async signIn(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Sign in failed');
        }
    },
};

export const courseService = {
    async createCourse(courseData) {
        try {
            const formData = new FormData();

            // Append basic course data
            formData.append('title', courseData.get('title'));
            formData.append('description', courseData.get('description'));
            formData.append('price', courseData.get('price'));

            // Append thumbnail
            const thumbnail = courseData.get('thumbnail');
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            // Get all lecture entries
            const lectures = courseData.getAll('video');
            const lectureTitles = courseData.getAll('lectureTitles[]');

            // Append lectures if they exist
            if (lectures.length > 0) {
                lectures.forEach((lecture, index) => {
                    if (lecture) {
                        formData.append('video', lecture);
                        formData.append(`lectureTitles`, lectureTitles[index]);
                    }
                });
            }

            const response = await api.post('/courses/create-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : new Error('Failed to create course');
        }
    },

    async getAllCourses() {
        try {
            const response = await api.get('/courses/get-courses');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch courses');
        }
    },

    async getCourseById(id) {
        try {
            const response = await api.get(`/courses/get-course/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch course');
        }
    },

    async deleteCourse(id) {
        try {
            const response = await api.delete(`/courses/delete-course/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to delete course');
        }
    }
};

export const paymentService = {
    async createOrder(courseId) {
        try {
            const response = await api.post('/payment/create-order', { courseId });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to create order');
        }
    },

    async verifyPayment(paymentData) {
        try {
            const response = await api.post('/payment/verify-payment', paymentData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to verify payment');
        }
    },

    async getEnrolledCourses() {
        try {
            const response = await api.get('/payment/enrolled-courses');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch enrolled courses');
        }
    }
};