import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";


export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
                    {/* About Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center justify-center space-x-2">
                            <ChefHat className="h-6 w-6" />
                            <span className="text-xl font-bold">BakeryEdu</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Transform your passion for baking into expertise with our professional courses. Learn from the best and start your culinary journey today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Quick Links</h3>
                        <nav className="flex flex-col items-center space-y-2">
                            {["Courses", "About Us", "Contact", "Blog"].map((text) => (
                                <Link
                                    key={text}
                                    to={`/${text.toLowerCase().replace(/\s+/g, "")}`}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {text}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Contact Us</h3>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>Email: <a href="mailto:info@bakeryedu.com">info@bakeryedu.com</a></p>
                            <p>Phone: (555) 123-4567</p>
                            <p>Address: 123 Baker Street</p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BakeryEdu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
