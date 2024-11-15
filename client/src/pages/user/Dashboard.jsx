import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    User,
    ShoppingCart,

    LogOut,
    TrendingUp,
    CreditCard,
    Activity,
    Menu,
    Bell,
    ChevronRight,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/context/AuthContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Sidebar Component
const Sidebar = React.memo(({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
        { icon: User, label: 'Profile', key: 'profile' },
        { icon: ShoppingCart, label: 'Purchases', key: 'purchases' },

    ]

    return (
        <aside className="w-72 bg-white border-r shadow-lg h-full flex flex-col max-h-screen overflow-y-auto hidden lg:flex">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={user?.avatar || "/placeholder-avatar.png"} alt={`${user?.name}'s avatar`} />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>

                    </div>
                </div>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {menuItems.map((item) => (
                    <Button
                        key={item.key}
                        variant={activeSection === item.key ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => onSectionChange(item.key)}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Button>
                ))}
            </nav>
            <div className="p-4 border-t">
                <Button variant="destructive" className="w-full" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    )
})

Sidebar.displayName = 'Sidebar'

// Mobile Sidebar
const MobileSidebar = React.memo(({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
        { icon: User, label: 'Profile', key: 'profile' },
        { icon: ShoppingCart, label: 'Purchases', key: 'purchases' },

    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <div className="mb-6 border-b pb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={user?.avatar || "/placeholder-avatar.png"} alt={`${user?.name}'s avatar`} />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.key}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                                onSectionChange(item.key)
                                document.querySelector('[data-testid="sheet-close"]')?.click()
                            }}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <Button variant="destructive" className="w-full" onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
})

MobileSidebar.displayName = 'MobileSidebar'

// Dashboard Main Component
const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard')
    const isMobile = useIsMobile()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = useCallback(() => {
        logout()
        navigate('/sign-in')
    }, [logout, navigate])

    const renderContent = useCallback(() => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent user={user} />
            case 'profile':
                return <ProfileContent user={user} />
            case 'purchases':
                return <PurchasesContent />
            default:
                return <DashboardContent user={user} />
        }
    }, [activeSection, user])

    return (
        <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
            <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <MobileSidebar
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                        onLogout={handleLogout}
                        user={user}
                    />
                </div>
            </header>
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
                user={user}
            />
            <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </main>
        </div>
    )
}

// Dashboard Content Component
const DashboardContent = React.memo(({ user }) => {
    const stats = [
        { icon: TrendingUp, label: 'Total Courses', value: '15', color: 'bg-green-100 text-green-600' },
        { icon: ShoppingCart, label: 'Purchases', value: '8', color: 'bg-blue-100 text-blue-600' },
        { icon: CreditCard, label: 'Total Spent', value: '$499', color: 'bg-purple-100 text-purple-600' },
    ]

    const recentActivities = [
        { icon: Activity, label: 'Enrolled in Baking Masterclass', date: '2 days ago' },
        { icon: ShoppingCart, label: 'Purchased Pastry Workshop', date: '1 week ago' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-muted-foreground">Here's an overview of your learning journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <div className={cn("p-2 rounded-full", stat.color)}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest learning activities and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentActivities.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={cn("p-2 rounded-full bg-gray-100")}>
                                    <activity.icon className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{activity.label}</p>
                                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
})

DashboardContent.displayName = 'DashboardContent'

// Placeholder components for other sections
const ProfileContent = React.memo(({ user }) => (
    <Card>
        <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                    <p className="text-lg font-semibold">Student</p>
                </div>
            </div>
        </CardContent>
    </Card>
))

ProfileContent.displayName = 'ProfileContent'

const PurchasesContent = React.memo(() => (
    <Card>
        <CardHeader>
            <CardTitle>Your Purchases</CardTitle>
            <CardDescription>A history of your course purchases and enrollments</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">No purchases made yet. Start your learning journey today!</p>
            <Button className="mt-4" >Browse Courses</Button>
        </CardContent>
    </Card>
))

PurchasesContent.displayName = 'PurchasesContent'


export default Dashboard