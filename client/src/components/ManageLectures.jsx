import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Save, X } from 'lucide-react';
import { courseService } from "@/services/api";
import { toast } from "sonner";

export default function ManageLectures({ courseId, lectures, onLectureAdded, onLectureUpdated }) {
    const [newLectureTitle, setNewLectureTitle] = useState('');
    const [newLectureVideo, setNewLectureVideo] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editingLectureId, setEditingLectureId] = useState(null);
    const [editingLectureTitle, setEditingLectureTitle] = useState('');

    const handleAddLecture = async (e) => {
        e.preventDefault();
        if (!newLectureTitle || !newLectureVideo) {
            toast.error("Please provide both title and video for the new lecture");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('title', newLectureTitle);
        formData.append('video', newLectureVideo);

        try {
            await courseService.addLecture(courseId, formData);
            toast.success("Lecture added successfully");
            setNewLectureTitle('');
            setNewLectureVideo(null);
            onLectureAdded();
        } catch (error) {
            toast.error(error.message || "Failed to add lecture");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            try {
                await courseService.deleteLecture(courseId, lectureId);
                toast.success("Lecture deleted successfully");
                onLectureAdded();
            } catch (error) {
                toast.error(error.message || "Failed to delete lecture");
            }
        }
    };

    const startEditingLecture = (lecture) => {
        setEditingLectureId(lecture._id);
        setEditingLectureTitle(lecture.title);
    };

    const cancelEditingLecture = () => {
        setEditingLectureId(null);
        setEditingLectureTitle('');
    };

    const saveLectureTitle = async (lectureId) => {
        try {
            await onLectureUpdated(lectureId, editingLectureTitle);
            setEditingLectureId(null);
            setEditingLectureTitle('');
        } catch (error) {
            toast.error(error.message || "Failed to update lecture title");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Lectures</h2>
            
            <form onSubmit={handleAddLecture} className="space-y-4">
                <Input
                    type="text"
                    placeholder="New Lecture Title"
                    value={newLectureTitle}
                    onChange={(e) => setNewLectureTitle(e.target.value)}
                    required
                />
                <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setNewLectureVideo(e.target.files[0])}
                    required
                />
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        'Add Lecture'
                    )}
                </Button>
            </form>

            <div className="space-y-4">
                {lectures?.map((lecture, index) => (
                    <div key={lecture._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        {editingLectureId === lecture._id ? (
                            <div className="flex items-center space-x-2 flex-grow">
                                <Input
                                    type="text"
                                    value={editingLectureTitle}
                                    onChange={(e) => setEditingLectureTitle(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button onClick={() => saveLectureTitle(lecture._id)} size="icon">
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button onClick={cancelEditingLecture} size="icon" variant="outline">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg font-medium">
                                    {index + 1}. {lecture.title}
                                </span>
                                <div className="space-x-2">
                                    <Button onClick={() => startEditingLecture(lecture)} size="icon" variant="outline">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => handleDeleteLecture(lecture._id)} size="icon" variant="destructive">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

