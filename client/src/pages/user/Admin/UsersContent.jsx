import { useEffect, useState, useCallback } from 'react'
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
import { UserPlus, Loader2, Search } from 'lucide-react'
import { authService } from '@/services/api'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UsersContent() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await authService.getAllUsers()
            setUsers(response.users)
        } catch (err) {
            setError('Failed to fetch users. Please try again later.')
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                <span className="text-2xl font-semibold">Loading...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-lg">{error}</p>
                </div>
            </div>
        )
    }

    const activeUsers = users.filter(user => user.status === "Active")
    const newUsers = users.filter(user => {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return new Date(user.createdAt) > oneMonthAgo
    })

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
                        <CardDescription>All registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                        <CardDescription>Users with active status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{activeUsers.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>New Users</CardTitle>
                        <CardDescription>Joined in the last month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{newUsers.length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage and monitor user activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-4">
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm mr-4"
                        />
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Enrolled Courses</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Status</TableHead>
                              
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.enrolledCourses}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
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