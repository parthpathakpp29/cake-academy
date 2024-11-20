import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import avatar1 from "../assets/avatar-1.avif";
import avatar2 from "../assets/avatar-2.avif";
import avatar3 from "../assets/avatar-3.avif";
import avatar4 from "../assets/avatar-4.avif";
import avatar5 from "../assets/avatar-5.avif";
import avatar6 from "../assets/avatar-6.avif";

const testimonials = [
    { text: "The artisan bread course transformed my baking skills. Highly recommended!", name: "Sarah Johnson", username: "@sarahj", imageSrc: avatar1 },
    { text: "I never thought I could make French pastries at home. This course made it possible!", name: "Michael Chen", username: "@michaelc", imageSrc: avatar2 },
    { text: "The cake decorating course helped me start my own bakery business. Thank you!", name: "Emily Davis", username: "@emilyd", imageSrc: avatar3 },
    { text: "This course has completely changed how I approach baking. Amazing content!", name: "Alex Thompson", username: "@alexT", imageSrc: avatar4 },
    { text: "The instructors are top-notch. I've learned so much in such a short time.", name: "Olivia Martinez", username: "@oliviaM", imageSrc: avatar5 },
    { text: "From a hobby to a profession - this course made it possible. Eternally grateful!", name: "Daniel Lee", username: "@danLee", imageSrc: avatar6 },
];

const TestimonialsColumn = ({ testimonials, duration = 15 }) => (
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
        {[...testimonials, ...testimonials].map((testimonial, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                    <div className="flex items-center gap-3 mt-4">
                        <img
                            src={testimonial.imageSrc}
                            alt={`Avatar of ${testimonial.name}`}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-medium leading-none">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.username}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </motion.div>
);

export default function TestimonialsSection() {
    const chunkSize = Math.ceil(testimonials.length / 2);
    const columns = Array.from({ length: 2 }, (_, i) => testimonials.slice(i * chunkSize, (i + 1) * chunkSize));

    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What our students say</h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                        From beginner bakers to professional chefs, our courses have helped thousands master the art of baking.
                    </p>
                </div>
                <div className="flex justify-center gap-6 overflow-hidden max-h-[800px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                    {columns.map((column, index) => (
                        <TestimonialsColumn key={index} testimonials={column} duration={15 + index * 5} />
                    ))}
                </div>
            </div>
        </section>
    );
}
