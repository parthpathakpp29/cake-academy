import { motion } from "framer-motion"
import { Clock, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const featuredCourses = [
    {
        id: 1,
        title: "Artisan Bread Making",
        description: "Learn the art of crafting delicious artisan breads, from crusty baguettes to rustic sourdough.",
        price: "₹999",
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=2070",
        duration: "8 weeks",
    },
    {
        id: 2,
        title: "French Pastry Mastery",
        description: "Master the techniques of creating exquisite French pastries, from croissants to éclairs.",
        price: "₹999",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1989",
        duration: "10 weeks",
    },
    {
        id: 3,
        title: "Cake Decorating 101",
        description: "Discover the secrets of professional cake decorating, from basic techniques to advanced designs.",
        price: "₹999",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1972",
        duration: "6 weeks",
    },
]

export default function FeaturedCourses() {
  const navigate = useNavigate()

    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Master the Art of Baking</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-[700px] mx-auto">
                        Choose from our most popular courses and start your culinary journey today.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Card className="group hover:shadow-lg transition-shadow">
                                <CardHeader className="p-0 relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        loading="lazy"
                                        className="w-full h-48 object-cover rounded-t-md"
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle>{course.title}</CardTitle>
                                    <CardDescription>{course.description}</CardDescription>
                                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {course.duration}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center p-4 border-t">
                                    <span className="text-xl font-semibold">{course.price}</span>
                                    <Button onClick = {() => navigate('/courses')}  variant="default" className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        Explore More
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
