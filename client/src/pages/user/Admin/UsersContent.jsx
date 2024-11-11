'use client'

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
import { UserPlus } from "lucide-react"

// Mock data - replace with actual data fetching
const users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        enrolledCourses: 3,
        joinDate: "2024-01-15",
        status: "Active",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        enrolledCourses: 2,
        joinDate: "2024-01-20",
        status: "Active",
    },
]

export default function UsersContent() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Users Management</h1>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                        <CardDescription>Active users on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                        <CardDescription>Currently enrolled in courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {users.filter(user => user.status === "Active").length}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>New Users</CardTitle>
                        <CardDescription>Joined this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">2</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage and monitor user activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Enrolled Courses</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.enrolledCourses}</TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            View Details
                                        </Button>
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