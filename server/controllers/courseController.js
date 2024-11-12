import courseModel from "../models/courseModel.js";
import { uploadThumbnail, uploadVideo } from "../utils/cloudinary.js";
import fs from 'fs';

export const createCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        // Validations
        if (!title || !description || !price) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.files?.thumbnail) {
            return res.status(400).send({
                success: false,
                message: "Course thumbnail is required"
            });
        }

        let thumbnailResult, videoResult;

        try {
            // Upload thumbnail
            thumbnailResult = await uploadThumbnail(req.files.thumbnail[0]);

            // Process video if present
            let videoData = null;
            if (req.files?.video && req.files.video[0]) {
                videoResult = await uploadVideo(req.files.video[0], 'temp', 1);
                videoData = {
                    title: title, // or you can pass a separate lecture title
                    videoUrl: videoResult.playbackUrl || videoResult.url,
                    videoPublicId: videoResult.publicId
                };
            }

            // Create course
            const course = await courseModel.create({
                title,
                description,
                price,
                thumbnail: {
                    url: thumbnailResult.url,
                    publicId: thumbnailResult.publicId
                },
                lectures: videoData ? [videoData] : [],
                instructor: req.user._id
            });

            // Clean up local files after successful upload and database save
            fs.unlinkSync(req.files.thumbnail[0].path);
            if (req.files?.video && req.files.video[0]) {
                fs.unlinkSync(req.files.video[0].path);
            }

            res.status(201).send({
                success: true,
                message: "Course created successfully",
                course
            });
        } catch (uploadError) {
            // If there's an error during upload or database save, clean up any uploaded files
            if (thumbnailResult && thumbnailResult.publicId) {
                await cloudinary.v2.uploader.destroy(thumbnailResult.publicId);
            }
            if (videoResult && videoResult.publicId) {
                await cloudinary.v2.uploader.destroy(videoResult.publicId, { resource_type: 'video' });
            }
            throw uploadError;
        }

    } catch (error) {
        console.error("Error in createCourse:", error);
        res.status(500).send({
            success: false,
            message: "Error in creating course",
            error: error.message
        });
    }
};

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel
            .find({})
            .select('-lectures.videoPublicId')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All Courses",
            totalCount: courses.length,
            courses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting courses",
            error
        });
    }
};

// Get Single Course
export const getCourseById = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send({
                success: false,
                message: "Course not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Course fetched successfully",
            course,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting course",
            error
        });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send({
                success: false,
                message: "Course not found"
            });
        }

        // Delete thumbnail from Cloudinary
        if (course.thumbnail.publicId) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.publicId);
        }

        // Delete all lecture videos from Cloudinary
        for (const lecture of course.lectures) {
            if (lecture.videoPublicId) {
                await cloudinary.v2.uploader.destroy(lecture.videoPublicId, {
                    resource_type: 'video'
                });
            }
        }

        await course.remove();

        res.status(200).send({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting course",
            error
        });
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const lectures = req.body.lectures ? JSON.parse(req.body.lectures) : null;

        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send({
                success: false,
                message: "Course not found"
            });
        }

        // Update basic info
        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;

        // Update thumbnail if provided
        if (req.files?.thumbnail) {
            // Delete old thumbnail
            if (course.thumbnail.publicId) {
                await cloudinary.v2.uploader.destroy(course.thumbnail.publicId);
            }

            // Upload new thumbnail
            const thumbnailResult = await uploadThumbnail(req.files.thumbnail[0]);
            course.thumbnail = {
                url: thumbnailResult.url,
                publicId: thumbnailResult.publicId
            };

            // Clean up local file
            fs.unlinkSync(req.files.thumbnail[0].path);
        }

        // Update lectures if provided
        if (lectures && req.files?.videos) {
            // Delete old videos
            for (const lecture of course.lectures) {
                if (lecture.videoPublicId) {
                    await cloudinary.v2.uploader.destroy(lecture.videoPublicId, {
                        resource_type: 'video'
                    });
                }
            }

            // Upload new videos
            const processedLectures = [];
            for (let i = 0; i < lectures.length; i++) {
                const videoFile = req.files.videos[i];
                const lectureTitle = lectures[i].title;

                const videoResult = await uploadVideo(videoFile, course._id, i + 1);

                processedLectures.push({
                    title: lectureTitle,
                    videoUrl: videoResult.playbackUrl || videoResult.url,
                    videoPublicId: videoResult.publicId
                });

                // Clean up local file
                fs.unlinkSync(videoFile.path);
            }

            course.lectures = processedLectures;
        }

        await course.save();

        res.status(200).send({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating course",
            error
        });
    }
};