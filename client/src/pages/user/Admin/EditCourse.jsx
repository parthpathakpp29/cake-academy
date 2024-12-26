import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageLectures from "@/components/ManageLectures";
import { courseService } from "@/services/api";
import { z } from "zod";
import { Loader2 } from 'lucide-react';

const editCourseSchema = z.object({
    title: z.string().min(5, 'Course title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().min(0, 'Price cannot be negative'),
});

export default function EditCourse() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(editCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
    });
    const fetchCourse = useCallback(async () => {
        try {
            const response = await courseService.getCourseById(id);
            setCourse(response.course);
            
            // Instead of form.reset, use form.setValue for each field
            // This preserves any unsaved changes
            form.setValue('title', response.course.title);
            form.setValue('description', response.course.description);
            form.setValue('price', response.course.price);
        } catch (error) {
            toast.error("Failed to fetch course details");
            navigate("/admin/dashboard");
        }
    }, [id, navigate, form]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());

            await courseService.updateCourse(id, formData);
            toast.success("Course updated successfully");
            fetchCourse(); // Refresh the course data
        } catch (error) {
            console.error("Error updating course:", error);
            toast.error(error.message || "Failed to update course");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleLectureUpdate = async (lectureId, newTitle) => {
        try {
            await courseService.updateLecture(id, lectureId, { title: newTitle });
            toast.success("Lecture title updated successfully");
            fetchCourse(); // Refresh the course data
        } catch (error) {
            console.error("Detailed Error updating lecture:", error);
            toast.error(
                error.message || 
                "Failed to update lecture title"
            );
        }
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Edit Course: {course.title}</h1>
            </div>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
                    <TabsTrigger value="manage-lectures">Manage Lectures</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter course title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter course description"
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (₹)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter course price"
                                                        min="0"
                                                        step="0.01"
                                                        className="max-w-xs"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Course'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="manage-lectures">
                    <Card>
                        <CardContent className="pt-6">
                            <ManageLectures 
                                courseId={id} 
                                lectures={course?.lectures}
                                onLectureAdded={fetchCourse}
                                onLectureUpdated={handleLectureUpdate}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

