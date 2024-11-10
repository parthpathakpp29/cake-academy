import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    User2,
    Settings,
    Bell,
    CircleUserRound,
    UserCircle2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || 'U';
    };

    const getDashboardLink = () => {
        return user?.role === 1 ? '/admin/dashboard' : '/dashboard';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative cursor-pointer"
                >
                    <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                            <AvatarImage
                                src={user?.profileImage}
                                alt={user?.name || 'User'}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5">
                                {user?.name ? (
                                    getInitials(user.name)
                                ) : (
                                    <UserCircle2 className="h-6 w-6 text-primary/70" />
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background animate-pulse" />
                    </div>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <User2 className="w-4 h-4 text-primary/70" />
                            <p className="font-semibold">{user?.name || 'User'}</p>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        to={getDashboardLink()}
                        className="flex items-center space-x-2 rounded-md"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{user?.role === 1 ? 'Admin Dashboard' : 'Dashboard'}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to="/settings"
                        className="flex items-center justify-between rounded-md"
                    >
                        <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">New</Badge>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center space-x-2 text-destructive focus:text-destructive rounded-md"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}