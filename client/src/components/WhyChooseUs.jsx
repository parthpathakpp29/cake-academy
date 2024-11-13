import { motion } from "framer-motion"
import { GraduationCap, HandPlatter, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const features = [
    {
        title: "Expert Instructors",
        description: "Learn from experienced bakers and pastry chefs who bring years of professional expertise to every lesson. Our instructors are passionate about sharing their knowledge and techniques.",
        icon: GraduationCap,
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        title: "Hands-on Experience",
        description: "Practice your skills with interactive online sessions designed to give you real-world experience. Get personalized feedback and guidance as you perfect your techniques.",
        icon: HandPlatter,
        color: "bg-green-500/10 text-green-500",
    },
    {
        title: "Flexible Learning",
        description: "Study at your own pace with our on-demand video lessons. Access course materials anytime, anywhere, and learn in a way that fits your schedule and lifestyle.",
        icon: Clock,
        color: "bg-purple-500/10 text-purple-500",
    },
]

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-gradient-to-b from-muted/50 to-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted/50">
                            Why Choose Us
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Learn from the Best</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
                            Discover why our baking courses stand out and how we help you achieve your culinary dreams
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 max-w-5xl mt-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.2,
                                ease: "easeOut",
                            }}
                        >
                            <Card className="relative overflow-hidden group">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-white to-muted opacity-0  transition-opacity"
                                    initial={false}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <CardHeader className="text-center pb-2">
                                    <div className={`mx-auto rounded-xl p-3 w-14 h-14 flex items-center justify-center ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}