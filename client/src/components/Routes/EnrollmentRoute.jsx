import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { courseService } from '@/services/api';

const EnrollmentRoute = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                const response = await courseService.checkEnrollment(courseId);
                setIsEnrolled(response.isEnrolled);
            } catch (error) {
                console.error('Enrollment check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId && user) {
            checkEnrollment();
        }
    }, [courseId, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isEnrolled ? <Outlet /> : <Navigate to={`/courses/${courseId}`} replace />;
};

export default EnrollmentRoute;