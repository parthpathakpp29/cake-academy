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
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async signUp(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Sign up failed');
        }
    },

    async signIn(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Sign in failed');
        }
    },

    async forgotPassword(email) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to retrieve security question');
        }
    },

    async resetPassword(data) {
        try {
            const response = await api.post('/auth/reset-password', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to reset password');
        }
    },
    
    async getTotalUsers() {
        try {
            const response = await api.get('/auth/total-users');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to fetch total users');
        }
    },
    async getAllUsers() {
        try {
            const response = await api.get('/auth/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to fetch users');
        }
    },
};

export const courseService = {
    async createCourse(courseData) {
        try {
            const formData = new FormData();

            formData.append('title', courseData.get('title'));
            formData.append('description', courseData.get('description'));
            formData.append('price', courseData.get('price'));

            const thumbnail = courseData.get('thumbnail');
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const lectures = courseData.getAll('video');
            const lectureTitles = courseData.getAll('lectureTitles[]');

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
            // The backend now returns signed URLs for videos, so no change needed here
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch course');
        }
    },

    async updateCourse(id, courseData) {
        try {
            const response = await api.put(`/courses/update-course/${id}`, courseData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : new Error('Failed to update course');
        }
    },

    async deleteCourse(id) {
        try {
            const response = await api.delete(`/courses/delete-course/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to delete course');
        }
    },

    async checkEnrollment(courseId) {
        try {
            const response = await api.get(`/courses/check-enrollment/${courseId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to check enrollment');
        }
    },

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
    async getUserPurchases() {
        try {
            const response = await api.get('/courses/user-purchases');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to fetch user purchases');
        }
    },
};



export const paymentService = {
    async getTotalRevenue() {
        try {
            const response = await api.get('/payment/total-revenue');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Failed to fetch total revenue');
        }
    },
};

