import { motion } from "framer-motion"
import { Clock, GraduationCap, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                            Featured Courses
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Master the Art of Baking</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose from our most popular courses and start your culinary journey today
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-16">
                    {featuredCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.2,
                                ease: "easeOut",
                            }}
                        >
                            <Card className="group relative overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="relative">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                            className="aspect-[4/3] overflow-hidden"
                                        >
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                            />
                                        </motion.div>

                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-2.5 p-4">
                                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {course.description}
                                    </CardDescription>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.students} students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 flex items-center justify-between border-t">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">{course.price}</span>
                                    </div>
                                    <Button className="group-hover:bg-primary">
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        Enroll More
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