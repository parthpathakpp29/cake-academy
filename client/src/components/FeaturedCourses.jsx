import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import Featured1 from '@/assets/featured1.avif'
import Featured2 from '@/assets/featured2.avif'
import Featured3 from '@/assets/featured3.avif'

const featuredCourses = [
    {
        id: 1,
        title: "Artisan Bread Making",
        description: "Learn the art of crafting delicious artisan breads, from crusty baguettes to rustic sourdough.",
        image: Featured1,
       
    },
    {
        id: 2,
        title: "French Pastry Mastery",
        description: "Master the techniques of creating exquisite French pastries, from croissants to éclairs.",
        image: Featured2,
    
    },
    {
        id: 3,
        title: "Cake Decorating 101",
        description: "Discover the secrets of professional cake decorating, from basic techniques to advanced designs.",
        image: Featured3,
    },
]

export default function FeaturedCourses() {
  const navigate = useNavigate()

    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Master the Art of Baking</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-[700px] mx-auto">
                        Choose from our most popular courses and start your culinary journey today.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center p-4 border-t">
                                    
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
