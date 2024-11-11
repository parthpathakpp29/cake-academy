'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Share2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Mock data - replace with actual data fetching
const courses = [
    {
        id: 1,
        title: "React & Redux Complete Course 2024",
        students: 1,
        revenue: "$100",
    },
    {
        id: 2,
        title: "Next JS Full Course 2025",
        students: 1,
        revenue: "$100",
    },
    {
        id: 3,
        title: "CSS Full Course 2025",
        students: 2,
        revenue: "$40",
    },
    {
        id: 4,
        title: "Python full course 2025",
        students: 1,
        revenue: "$500",
    },
    {
        id: 5,
        title: "HTML Full Course 2025",
        students: 0,
        revenue: "$0",
    },
]

export default function CoursesContent() {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Courses</CardTitle>
                    <Button
                        onClick={() => navigate('/admin/courses/create')}
                        className="bg-black text-white hover:bg-black/90"
                    >
                        Create New Course
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>{course.students}</TableCell>
                                    <TableCell>{course.revenue}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit course</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Share2 className="h-4 w-4" />
                                                <span className="sr-only">Share course</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}