import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    async signUp(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Sign up error:', error.response?.data || error.message);
            throw error.response ? error.response.data : new Error('Sign up failed');
        }
    },

    async signIn(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Sign in error:', error.response?.data || error.message);
            throw error.response ? error.response.data : new Error('Sign in failed');
        }
    },
};

export default api;