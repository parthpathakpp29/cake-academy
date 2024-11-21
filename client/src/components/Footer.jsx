import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import Logo from "../assets/logo3.png";

export default function Footer() {
    // Define a mapping of display text to route paths
    const policyLinks = [
        { text: "About Us", path: "/about-us" },
        { text: "Privacy Policy", path: "/privacy-policy" },
        { text: "Refund Policy", path: "/refund-policy" },
        { text: "Terms & Conditions", path: "/terms-and-conditions" }
    ];

    return (
        <footer className="bg-muted/50 border-t">
            <div className="container px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
                    {/* About Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center justify-center space-x-2">
                            <ChefHat className="h-6 w-6" />
                            <span className="text-xl font-bold">{Logo}</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Transform your passion for baking into expertise with our professional courses. Learn from the best and start your culinary journey today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Quick Links</h3>
                        <nav className="flex flex-col items-center space-y-2">
                            {policyLinks.map((link) => (
                                <Link
                                    key={link.text}
                                    to={link.path}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Contact Us</h3>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>Email: <a href="mailto:professionalcakemakingclass@gmail.com">professionalcakemakingclass@gmail.com</a></p>
                            <p></p>
                            <p>Sulonguri, Gouranga Nagar,
                     Newtown, Kolkata-700162</p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Cake Making Class. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
