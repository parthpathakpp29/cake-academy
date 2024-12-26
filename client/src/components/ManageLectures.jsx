import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Upload, Loader2, Trash2 } from 'lucide-react';
import { courseService } from "@/services/api";
import { Progress } from "@/components/ui/progress";

const lectureSchema = z.object({
    title: z.string().min(1, "Title is required"),
    video: z.instanceof(File, { message: "Video is required" })
});

export default function ManageLectures({ courseId, onLectureAdded, lectures }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const form = useForm({
        resolver: zodResolver(lectureSchema),
        defaultValues: {
            title: "",
            video: null
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setUploadProgress(0);
            const formData = new FormData();
            formData.append('title', data.title.trim());
            formData.append('video', data.video);

            await courseService.addLecture(courseId, formData, (progress) => {
                setUploadProgress(progress);
            });
            toast.success("Lecture added successfully");
            form.reset();
            if (onLectureAdded) onLectureAdded();
        } catch (error) {
            toast.error(error.message || "Failed to add lecture");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        try {
            setIsDeleting(true);
            await courseService.deleteLecture(courseId, lectureId);
            toast.success("Lecture deleted successfully");
            if (onLectureAdded) onLectureAdded();
        } catch (error) {
            toast.error(error.message || "Failed to delete lecture");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lecture Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter lecture title"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="video"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Video</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('video-upload').click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Video
                                        </Button>
                                        <input
                                            id="video-upload"
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onChange(file);
                                            }}
                                            {...field}
                                        />
                                        {value && (
                                            <span className="text-sm text-gray-500">
                                                {value.name}
                                            </span>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isSubmitting && (
                        <div className="space-y-2">
                            <Progress value={uploadProgress} />
                            <p className="text-sm text-center text-muted-foreground">
                                Uploading: {uploadProgress}%
                            </p>
                        </div>
                    )}

                    <Button 
                        type="button" 
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Add Lecture'
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Current Lectures</h3>
                <div className="space-y-4">
                    {lectures?.map((lecture, index) => (
                        <div key={lecture._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <span className="font-medium">Lecture {index + 1}: </span>
                                {lecture.title}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteLecture(lecture._id)}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 