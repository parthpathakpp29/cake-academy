import React, { useState, useEffect } from 'react'
import { courseService } from "@/services/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const AllCourses = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses()
                setCourses(response.courses)
                setLoading(false)
            } catch (error) {
                toast.error("Failed to fetch courses")
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All Courses</h1>

            {courses.length === 0 ? (
                <p className="text-center text-muted-foreground">No courses available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course._id} className="hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <img
                                    src={course.thumbnail?.url}
                                    alt={course.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-primary">
                                        ₹{course.price}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">
                                            {course.lectures?.length || 0} Lectures
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/courses/${course._id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllCourses