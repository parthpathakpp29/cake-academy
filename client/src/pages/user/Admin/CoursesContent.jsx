import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Edit, Share2, Trash2, Loader2, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { courseService } from "@/services/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CoursesContent() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            const response = await courseService.getAllCourses()
            setCourses(response.courses)
        } catch (error) {
            toast.error("Failed to fetch courses")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await courseService.deleteCourse(deleteId)
            toast.success("Course deleted successfully")
            fetchCourses()
        } catch (error) {
            toast.error("Failed to delete course")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    const sortedCourses = React.useMemo(() => {
        let sortableCourses = [...courses]
        if (sortConfig.key) {
            sortableCourses.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }
        return sortableCourses
    }, [courses, sortConfig])

    const filteredCourses = sortedCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Courses Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Manage and monitor your courses</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/courses/create')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create New Course
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courses.length}</div>
                    </CardContent>
                </Card>
                
                
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>A list of all your courses including their title, students, and revenue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <Input
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm mr-4"
                            />
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select rows per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 per page</SelectItem>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">
                                    <Button variant="ghost" onClick={() => handleSort('title')}>
                                        Course
                                        {sortConfig.key === 'title' && (
                                            <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                        )}
                                    </Button>
                                </TableHead>
                               
                                <TableHead>Lectures</TableHead>
                                <TableHead className="text-right">
                                    <Button variant="ghost" onClick={() => handleSort('price')}>
                                        Price
                                        {sortConfig.key === 'price' && (
                                            <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                        )}
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCourses.map((course) => (
                                <TableRow key={course._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <Avatar className="h-9 w-9 mr-2">
                                                <AvatarImage src={course.thumbnail?.url} alt={course.title} />
                                                <AvatarFallback>{course.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="cursor-pointer hover:underline" onClick={() => navigate(`/courses/${course._id}`)}>
                                                {course.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{course.lectures?.length || 0}</TableCell>
                                    <TableCell className="text-right">₹{course.price.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="12" cy="5" r="1"></circle>
                                                        <circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigate(`/admin/courses/${course._id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    toast.info("Share functionality coming soon")
                                                }}>
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    Share
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setDeleteId(course._id)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} entries
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course and all its content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}