import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from "@/services/api";
import { toast } from "sonner";
import { Loader2, Search, BookOpen, Clock, Tag, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import debounce from 'lodash/debounce'

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const fetchCourses = useCallback(async () => {
        try {
            const response = await courseService.getAllCourses();
            setCourses(response.courses);
        } catch (error) {
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const debouncedSearch = useMemo(
        () => debounce((query) => setSearchTerm(query), 300),
        []
    );

    const filteredCourses = useMemo(() => {
        return courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'all' || course.category === selectedCategory)
        );
    }, [courses, searchTerm, selectedCategory]);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(courses.map(course => course.category).filter(Boolean));
        return ['all', ...uniqueCategories];
    }, [courses]);

    const formatCategory = useCallback((category) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover a wide range of courses designed to help you achieve your learning goals
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-10"
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="whitespace-nowrap"
                            >
                                {formatCategory(category)}
                            </Button>
                        ))}
                    </div>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                <p className="text-xl text-gray-600">No courses found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} navigate={navigate} formatCategory={formatCategory} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CourseCard = React.memo(({ course, navigate, formatCategory }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative overflow-hidden">
            <img
                src={course.thumbnail?.url || '/placeholder.svg?height=320&width=400'}
                alt={course.title}
                className="w-full h-[200px] object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            {course.category && (
                <Badge className="absolute top-4 right-4 bg-primary/90">
                    {formatCategory(course.category)}
                </Badge>
            )}
        </div>
        <CardHeader>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
                {course.description || 'No description available'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lectures?.length || 0} Lectures</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || '8 weeks'}</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                        ₹{course.price || 0}
                    </span>
                </div>
                <Button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="group-hover:translate-x-1 transition-transform"
                >
                    View Course
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </CardContent>
    </Card>
));

CourseCard.displayName = 'CourseCard';

export default AllCourses;