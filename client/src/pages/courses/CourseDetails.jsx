import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from "@/services/api";
import { toast } from "sonner";
import { Loader2, Play, Phone, Mail, MapPin, Clock, Users, Award, BookOpen, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";


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

        if (id) {
            fetchCourseDetails();
        }
    }, [id, navigate]);

    const handleStartCourse = () => {
        if (course?._id) {
            navigate(`/courses/${course._id}/lecture/0`);
        } else {
            toast.error("Course not available");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <h2 className="text-2xl font-bold">Course Not Found</h2>
                    <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/courses')} className="mt-4">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <nav className="flex items-center text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="mx-2">›</span>
                        <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-900">{course.title}</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="lg:flex-1">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">Featured</Badge>
                                    <Badge variant="outline" className="text-primary">
                                        {course.category || 'Online Course'}
                                    </Badge>
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                                <p className="text-xl text-gray-600 leading-relaxed">{course.description}</p>
                                
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span>{course.enrolledStudents || '0'} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-primary" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                                {course.instructor && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span className="text-gray-600">Instructor: {course.instructor.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Curriculum */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                                    <p className="text-gray-600">Master the fundamentals through structured lessons</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{course.lectures?.length || 0}</div>
                                    <div className="text-sm text-gray-600">Total Lessons</div>
                                    {/* <div className="text-sm text-gray-600">
                                        Total Duration: {totalDuration} mins
                                    </div> */}
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="space-y-4">
                                {course.lectures?.map((lecture, index) => (
                                    <AccordionItem 
                                        key={index} 
                                        value={`item-${index}`}
                                        className="border rounded-lg px-4"
                                    >
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                    <Play className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">Lesson {index + 1}: {lecture.title}</div>
                                                    {/* <div className="text-sm text-gray-500">
                                                        {lecture.duration ? `${lecture.duration} mins` : 'Duration not specified'}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 pb-4">
                                            <div className="pl-12">
                                                <p className="text-gray-600">{lecture.description || 'No description available'}</p>
                                                {lecture.resources && (
                                                    <div className="mt-4">
                                                        <h4 className="font-medium mb-2">Resources:</h4>
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {lecture.resources.map((resource, idx) => (
                                                                <li key={idx} className="text-primary hover:underline">
                                                                    <a href={resource.url}>{resource.title}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardContent className="p-6 space-y-6">
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                                    <img
                                        src={course.thumbnail?.url || '/placeholder.svg?height=320&width=400'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={handleStartCourse}
                                    >
                                        Start Course
                                    </Button>
                                    <p className="text-center text-sm text-gray-500">
                                        30-day money-back guarantee
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Course Features:</h3>
                                    <ul className="space-y-3">
                                       
                                        <li className="flex items-center text-gray-600">
                                            <Play className="h-5 w-5 mr-3 text-primary" />
                                            {course.lectures?.length || 0} Video lessons
                                        </li>
                                        <li className="flex items-center text-gray-600">
                                            <Award className="h-5 w-5 mr-3 text-primary" />
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
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