import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
    const { user, token } = useAuth();

    // Optional: Add token validation if needed
    const isTokenValid = () => {
        if (!token) return false;

        try {
            // If you're using JWT, you can decode and check expiration
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    };

    return user && token && isTokenValid() ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;