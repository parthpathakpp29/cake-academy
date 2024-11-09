import * as React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChefHat, Menu, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"
import Logo from '../assets/logo3.png'
import { useAuth } from "@/context/AuthContext"
import Profile from "./Profile"


export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { user, logout } = useAuth();

    return (
        <motion.header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <nav className="container flex items-center justify-between p-4">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={Logo} alt="Logo" className="h1 w-20" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/courses"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Courses
                    </Link>
                    {user ? (
                        <>
                            <Profile />
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/sign-in">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link to="/sign-up">Sign Up</Link>
                            </Button>
                        </>
                    )

                    }


                    <ModeToggle />
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                {isOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem asChild>
                                <Link to="/courses" className="w-full">
                                    Courses
                                </Link>
                            </DropdownMenuItem>

                            {user ? (
                                <>
                                    <Profile />
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link to="/sign-in" className="w-full">Sign In</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/sign-up" className="w-full">Sign Up</Link>
                                    </DropdownMenuItem>
                                </>
                            )}

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </motion.header>
    )
}