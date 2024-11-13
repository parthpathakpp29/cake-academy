import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    User,
    ShoppingCart,
    Settings,
    LogOut,
    TrendingUp,
    CreditCard,
    Activity,
    Menu,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/context/AuthContext'

// Sidebar Component
const Sidebar = ({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            key: 'dashboard'
        },
        {
            icon: User,
            label: 'Profile',
            key: 'profile'
        },
        {
            icon: ShoppingCart,
            label: 'Purchases',
            key: 'purchases'
        },
        {
            icon: Settings,
            label: 'Settings',
            key: 'settings'
        }
    ]

    return (
        <div className="w-72 bg-white border-r shadow-lg h-full flex flex-col max-h-screen overflow-y-auto hidden md:flex">
            {/* User Profile Section */}
            <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage
                            src={user?.avatar || "https://github.com/shadcn.png"}
                            alt="User Avatar"
                        />
                        <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
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

            {/* Logout Section */}
            <div className="p-4 border-t">
                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

// Mobile Sidebar
const MobileSidebar = ({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            key: 'dashboard'
        },
        {
            icon: User,
            label: 'Profile',
            key: 'profile'
        },
        {
            icon: ShoppingCart,
            label: 'Purchases',
            key: 'purchases'
        },
        {
            icon: Settings,
            label: 'Settings',
            key: 'settings'
        }
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                {/* User Profile Section */}
                <div className="mb-6 border-b pb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={user?.avatar || "https://github.com/shadcn.png"}
                                alt="User Avatar"
                            />
                            <AvatarFallback>
                                {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.key}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                                onSectionChange(item.key)
                                // Close sheet
                                document.querySelector('[data-testid="sheet-close"]')?.click()
                            }}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={onLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

// Dashboard Main Component
const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard')
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/sign-in')
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent user={user} />
            case 'profile':
                return <ProfileContent user={user} />
            case 'purchases':
                return <PurchasesContent />
            case 'settings':
                return <SettingsContent />
            default:
                return <DashboardContent user={user} />
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <MobileSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={handleLogout}
                    user={user}
                />
            </header>

            {/* Sidebar for larger screens */}
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
                user={user}
            />

            <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    )
}

// Dashboard Content Component
const DashboardContent = ({ user }) => {
    const stats = [
        {
            icon: TrendingUp,
            label: 'Total Courses',
            value: '15',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: ShoppingCart,
            label: 'Purchases',
            value: '8',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: CreditCard,
            label: 'Total Spent',
            value: '$499',
            color: 'bg-purple-100 text-purple-600'
        }
    ]

    const recentActivities = [
        {
            icon: Activity,
            label: 'Enrolled in Baking Masterclass',
            date: '2 days ago'
        },
        {
            icon: ShoppingCart,
            label: 'Purchased Pastry Workshop',
            date: '1 week ago'
        }
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-muted-foreground">Here's an overview of your learning journey</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentActivities.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-4 border-b last:border-b-0"
                        >
                            <div className="flex items-center space-x-4">
                                <activity.icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{activity.label}</p>
                                </div>
                            </div>
                            <Badge variant="outline">{activity.date}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

// Placeholder components for other sections
const ProfileContent = ({ user }) => (
    <Card>
        <CardHeader>
            <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-semibold">{user?.name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-semibold">January 2023</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-semibold">Student</p>
                </div>
            </div>
        </CardContent>
    </Card>
)

const PurchasesContent = () => (
    <Card>
        <CardHeader>
            <CardTitle>Your Purchases</CardTitle>
        </CardHeader>
        <CardContent>
            <p>No purchases made yet.</p>
        </CardContent>
    </Card>
)

const SettingsContent = () => (
    <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Settings options will be available here.</p>
        </CardContent>
    </Card>
)

export default Dashboard