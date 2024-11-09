import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatar6 from "../assets/avatar-6.png";
import avatar7 from "../assets/avatar-7.png";
import avatar8 from "../assets/avatar-8.png";
import avatar9 from "../assets/avatar-9.png";

const testimonials = [
    { text: "The artisan bread course transformed my baking skills. Highly recommended!", name: "Sarah Johnson", username: "@sarahj", imageSrc: avatar1 },
    { text: "I never thought I could make French pastries at home. This course made it possible!", name: "Michael Chen", username: "@michaelc", imageSrc: avatar2 },
    { text: "The cake decorating course helped me start my own bakery business. Thank you!", name: "Emily Davis", username: "@emilyd", imageSrc: avatar3 },
    { text: "This course has completely changed how I approach baking. Amazing content!", name: "Alex Thompson", username: "@alexT", imageSrc: avatar4 },
    { text: "The instructors are top-notch. I've learned so much in such a short time.", name: "Olivia Martinez", username: "@oliviaM", imageSrc: avatar5 },
    { text: "From a hobby to a profession - this course made it possible. Eternally grateful!", name: "Daniel Lee", username: "@danLee", imageSrc: avatar6 },
    //     { text: "The techniques I've learned here have elevated my baking to a whole new level.", name: "Sophie Wilson", username: "@sophieW", imageSrc: avatar7 },
    //     { text: "Incredible value for money. The skills I've gained are priceless.", name: "Ryan Garcia", username: "@ryanG", imageSrc: avatar8 },
    //     { text: "This course gave me the confidence to open my own patisserie. Thank you!", name: "Emma Brown", username: "@emmaB", imageSrc: avatar9 },
];

const TestimonialsColumn = ({ testimonials, className = "", duration = 15 }) => (
    <div className={className}>
        <motion.div
            animate={{ translateY: "-50%" }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
            }}
            className="flex flex-col gap-6 pb-6"
        >
            {[...Array(2)].map((_, index) => (
                <div key={index} className="flex flex-col gap-6">
                    {testimonials.map((testimonial, i) => (
                        <Card key={i} className="bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <img src={testimonial.imageSrc} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium leading-none">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.username}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ))}
        </motion.div>
    </div>
);

export default function TestimonialsSection() {
    const firstColumn = testimonials.slice(0, 3);
    const secondColumn = testimonials.slice(3, 6);
    // const thirdColumn = testimonials.slice(6, 9);

    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What our students say</h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">From beginner bakers to professional chefs, our courses have helped thousands master the art of baking.</p>
                </div>
                <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[800px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={20} />
                    {/* <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} /> */}
                </div>
            </div>
        </section>
    );
}