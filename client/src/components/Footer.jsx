import { Link } from "react-router-dom"
import { ChefHat, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <ChefHat className="h-6 w-6" />
                            <span className="text-xl font-bold">BakeryEdu</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Transform your passion for baking into expertise with our professional courses.
                            Learn from the best and start your culinary journey today.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Quick Links</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Courses
                            </Link>
                            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                About Us
                            </Link>
                            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Contact
                            </Link>
                            <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Blog
                            </Link>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Contact Us</h3>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>Email: info@bakeryedu.com</p>
                            <p>Phone: (555) 123-4567</p>
                            <p>Address: 123 Baker Street</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for recipes, tips, and updates.
                        </p>
                        <form className="flex space-x-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="max-w-[220px]"
                            />
                            <Button type="submit">
                                Subscribe
                            </Button>
                        </form>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BakeryEdu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}