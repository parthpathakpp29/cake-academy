import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from "@/services/api";
import { toast } from "sonner";
import { Loader2, ChevronDown, Play, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await courseService.getCourseById(id);
                setCourse(response.course);
            } catch (error) {
                toast.error("Failed to fetch course details");
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Course not found</p>
                <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white py-8 mb-8 shadow-sm">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="mx-2">›</span>
                        <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
                        <span className="mx-2">›</span>
                        <span>{course.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                            <p className="text-gray-600">{course.description}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes?.map((outcome, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                        <p className="text-gray-600">{outcome}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                            <ul className="space-y-4">
                                {course.requirements?.map((requirement, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                        <p className="text-gray-600">{requirement}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Curriculum</h2>
                                <span className="text-gray-500">{course.lectures?.length || 0} Lessons</span>
                            </div>
                            <Accordion type="single" collapsible className="space-y-4">
                                {course.lectures?.map((lecture, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center space-x-3">
                                                <Play className="h-5 w-5 text-primary" />
                                                <span className="font-medium">Lesson {index + 1}: {lecture.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-gray-600">{lecture.description || 'No description available'}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardContent className="p-6 space-y-6">
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={course.thumbnail?.url || '/placeholder.svg?height=320&width=400'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <Button className="w-full" size="lg">
                                    Join Course
                                </Button>

                                <div>
                                    <h3 className="font-semibold text-lg mb-4">This Course Includes:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-gray-600">
                                            <Play className="h-4 w-4 mr-2 text-primary" />
                                            {course.lectures?.length || 0} Video Lessons
                                        </li>
                                        <li className="flex items-center text-gray-600">
                                            <Phone className="h-4 w-4 mr-2 text-primary" />
                                            Access on mobile, tablet and desktop
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-primary/10 rounded-lg p-6">
                                    <h3 className="font-semibold text-lg mb-4">Have Any Questions?</h3>
                                    <div className="space-y-4">
                                        <a href="tel:+421914414257" className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors">
                                            <Phone className="h-5 w-5 text-primary" />
                                            <span>(+421) 914 414 257</span>
                                        </a>
                                        <a href="mailto:support@domain.com" className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors">
                                            <Mail className="h-5 w-5 text-primary" />
                                            <span>support@domain.com</span>
                                        </a>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span>JI. Sunset Road No 815, Kuta</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;