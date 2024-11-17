import { motion } from "framer-motion"
import { GraduationCap, HandPlatter, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const features = [
    {
        title: "Expert Instructors",
        description: "Learn from experienced bakers and pastry chefs with years of professional expertise.",
        icon: GraduationCap,
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        title: "Hands-on Experience",
        description: "Practice with interactive sessions and get personalized feedback.",
        icon: HandPlatter,
        color: "bg-green-500/10 text-green-500",
    },
    {
        title: "Flexible Learning",
        description: "Access on-demand lessons and learn at your own pace.",
        icon: Clock,
        color: "bg-purple-500/10 text-purple-500",
    },
]

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-gradient-to-b from-muted/50 to-muted">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Why Choose Us</h2>
                    <p className="mt-4 text-muted-foreground max-w-[700px] mx-auto">
                        Discover why our baking courses stand out and how we help you achieve your culinary dreams.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
                        >
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center">
                                    <div
                                        className={`rounded-full p-4 mx-auto mb-4 ${feature.color}`}
                                    >
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">{feature.title}</h3>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
