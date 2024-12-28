import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { courseService } from "@/services/api"


export default function FeaturedCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await courseService.getAllCourses()
        // Limit to 3 most recent courses
        const featuredCourses = response.courses.slice(0, 3)
        setCourses(featuredCourses)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/50 flex justify-center items-center">
       Loading .....
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/50 text-center">
        <p className="text-red-500">Failed to load courses. Please try again later.</p>
      </section>
    )
  }

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
          {courses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0 relative">
                  <img
                    src={course.thumbnail?.url || '/placeholder-image.jpg'}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-48 object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Price: ₹{course.price}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 border-t">
                  <Button 
                    onClick={() => navigate(`/courses/${course._id}`)} 
                    variant="default" 
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    View Course
                  </Button>
                  <a href="https://www.youtube.com/watch?v=am-hlPdhIqg" target="_blank" rel="noopener noreferrer">
                    <Button variant="default" className="flex items-center gap-2 ">
                        Watch Introduction
                    </Button>
                    </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
