import React, { useState } from 'react';
import {
    LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu,
    DollarSign, UserCheck, BookOpenCheck
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboardContent from './AdminDashboardContent';
import UsersContent from './UsersContent';
import CoursesContent from './CoursesContent';

// Sidebar Component
const Sidebar = ({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
        { icon: Users, label: 'Users', key: 'users' },
        { icon: BookOpen, label: 'Courses', key: 'courses' },

    ]

    return (
        <div className="w-72 bg-white border-r shadow-lg h-full flex flex-col max-h-screen overflow-y-auto hidden md:flex">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt="Admin Avatar" />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">Admin</p>
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
        </div>
    )
}

// Mobile Sidebar
const MobileSidebar = ({ activeSection, onSectionChange, onLogout, user }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
        { icon: Users, label: 'Users', key: 'users' },
        { icon: BookOpen, label: 'Courses', key: 'courses' },
        { icon: Settings, label: 'Settings', key: 'settings' },
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <div className="mb-6 border-b pb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt="Admin Avatar" />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-sm text-muted-foreground">Admin</p>
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
}

// Admin Dashboard Main Component
const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard')
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/sign-in')
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <AdminDashboardContent />
            case 'users':
                return <UsersContent />
            case 'courses':
                return <CoursesContent />
            default:
                return <AdminDashboardContent />
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
            <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <MobileSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={handleLogout}
                    user={user}
                />
            </header>
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

// Admin Dashboard Content Component

// Placeholder components for other sections





export default AdminDashboard