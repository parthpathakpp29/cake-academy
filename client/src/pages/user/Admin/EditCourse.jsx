import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import ManageLectures from '@/components/ManageLectures'
import { useState, useCallback } from "react"
import { courseService } from "@/services/api"

export default function EditCourse() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [course, setCourse] = useState(null)

    const fetchCourse = useCallback(async () => {
        try {
            const response = await courseService.getCourseById(id)
            setCourse(response.course)
        } catch (error) {
            toast.error("Failed to fetch course details")
            navigate("/admin/dashboard")
        }
    }, [id, navigate])

    React.useEffect(() => {
        fetchCourse()
    }, [fetchCourse])

    if (!course) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Lectures: {course.title}</h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <ManageLectures 
                        courseId={id} 
                        lectures={course?.lectures}
                        onLectureAdded={() => {
                            fetchCourse()
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}