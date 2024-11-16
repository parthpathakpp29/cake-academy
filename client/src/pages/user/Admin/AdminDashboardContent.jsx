import { useEffect, useState } from 'react';
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";

import { Loader2 } from 'lucide-react';
import { authService, courseService, paymentService } from '@/services/api';

export default function AdminDashboardContent() {
    const [stats, setStats] = useState([
        { label: 'Total Users', value: '0' },
        { label: 'Active Courses', value: '0' },
        { label: 'Total Revenue', value: '₹0' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [coursesResponse, usersResponse, revenueResponse] = await Promise.all([
                    courseService.getAllCourses(),
                    authService.getTotalUsers(),
                    paymentService.getTotalRevenue()
                ]);

                setStats([
                    { label: 'Total Users', value: usersResponse.totalUsers.toString() },
                    { label: 'Active Courses', value: coursesResponse.totalCount.toString() },
                    { label: 'Total Revenue', value: `₹${revenueResponse.totalRevenue.toFixed(2)}` },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                <span className="text-2xl font-semibold">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}