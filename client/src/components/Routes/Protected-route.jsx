import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
    const { user, token } = useAuth();
    
    const isTokenValid = () => {
        if (!token) return false;

        try {
          
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    };

    return user && token && isTokenValid() ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
