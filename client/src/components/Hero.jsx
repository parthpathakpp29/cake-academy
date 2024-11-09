import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, GraduationCap, Timer, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
    {
        image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1932",
        title: "Master the Art of Baking",
        description: "Learn from world-class pastry chefs and start your culinary journey today",
        stats: [
            { icon: Users, label: "1000+ Students" },
            { icon: Timer, label: "20+ Courses" },
            { icon: GraduationCap, label: "Expert Instructors" },
        ],
    },
    {
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1989",
        title: "Professional Pastry Courses",
        description: "From basics to advanced techniques, we've got you covered",
        stats: [
            { icon: Users, label: "24/7 Support" },
            { icon: Timer, label: "Flexible Learning" },
            { icon: GraduationCap, label: "Certificate" },
        ],
    },
    {
        image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80&w=2070",
        title: "Hands-on Experience",
        description: "Practice with real recipes and get personalized feedback",
        stats: [
            { icon: Users, label: "Community" },
            { icon: Timer, label: "Live Sessions" },
            { icon: GraduationCap, label: "Projects" },
        ],
    },
]

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [])

    const previousSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [])

    useEffect(() => {
        if (!isAutoPlaying) return
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [isAutoPlaying, nextSlide])

    return (
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentSlide}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                >
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50">
                        <div className="container relative h-full px-4">
                            <div className="flex h-full items-center">
                                <div className="max-w-3xl">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="space-y-2"
                                    >
                                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary-foreground backdrop-blur-sm">
                                            Welcome to BakeryEdu
                                        </div>
                                        <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                            {slides[currentSlide].title}
                                        </h1>
                                        <p className="max-w-[600px] text-lg text-gray-300 md:text-xl">
                                            {slides[currentSlide].description}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="mt-8 flex flex-wrap gap-4"
                                    >
                                        <Button size="lg" className="h-12 px-8">
                                            Start Learning
                                        </Button>
                                        <Button size="lg" variant="outline" className="h-12 px-8">
                                            View Courses
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="mt-12 flex gap-8"
                                    >
                                        {slides[currentSlide].stats.map((stat, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <stat.icon className="h-5 w-5 text-primary" />
                                                <span className="text-sm font-medium text-gray-300">{stat.label}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={previousSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="group absolute left-4 top-1/2 -translate-y-1/2 md:left-8"
                aria-label="Previous slide"
            >
                <div className="rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all group-hover:bg-black/50">
                    <ChevronLeft className="h-6 w-6" />
                </div>
            </button>

            <button
                onClick={nextSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="group absolute right-4 top-1/2 -translate-y-1/2 md:right-8"
                aria-label="Next slide"
            >
                <div className="rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all group-hover:bg-black/50">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentSlide(index)
                            setIsAutoPlaying(false)
                        }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        className="group"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div
                            className={cn(
                                "h-1.5 w-8 rounded-full transition-all",
                                index === currentSlide
                                    ? "bg-white"
                                    : "bg-white/50 group-hover:bg-white/75"
                            )}
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}