import courseModel from "../models/courseModel.js";
import { uploadThumbnail, uploadVideo } from "../utils/cloudinary.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import { createError } from "../utils/error.js";

export const createCourse = async (req, res, next) => {
    const { title, description, price, lectureTitles } = req.body;
    let thumbnailResult, lectureResults = [];

    try {
        // Validations
        if (!title || !description || !price || !req.files?.thumbnail) {
            throw createError(400, "Missing required fields");
        }

        // Upload thumbnail
        thumbnailResult = await uploadThumbnail(req.files.thumbnail[0]);

        // Process videos if present
        if (req.files.video) {
            lectureResults = await Promise.all(req.files.video.map(async (videoFile, index) => {
                const lectureTitle = lectureTitles[index] || `Lecture ${index + 1}`;
                const videoResult = await uploadVideo(videoFile, "temp", index + 1);
                return {
                    title: lectureTitle,
                    videoUrl: videoResult.playbackUrl || videoResult.url,
                    videoPublicId: videoResult.publicId,
                };
            }));
        }

        // Create course
        const course = await courseModel.create({
            title,
            description,
            price,
            thumbnail: {
                url: thumbnailResult.url,
                publicId: thumbnailResult.publicId,
            },
            lectures: lectureResults,
            instructor: req.user._id, // Assuming you have user authentication middleware
        });

        // Clean up local files
        await Promise.all([
            fs.unlink(req.files.thumbnail[0].path),
            ...req.files.video?.map(video => fs.unlink(video.path)) || []
        ]);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        // Clean up uploaded files on error
        if (thumbnailResult?.publicId) {
            await cloudinary.v2.uploader.destroy(thumbnailResult.publicId);
        }
        for (const lecture of lectureResults) {
            if (lecture.videoPublicId) {
                await cloudinary.v2.uploader.destroy(lecture.videoPublicId, { resource_type: "video" });
            }
        }
        next(error);
    }
};

export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseModel
            .find({})
            .select('-lectures.videoPublicId')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            message: "All Courses",
            totalCount: courses.length,
            courses,
        });
    } catch (error) {
        next(createError(500, "Error in getting courses"));
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const course = await courseModel.findById(req.params.id).lean();
        if (!course) {
            throw createError(404, "Course not found");
        }
        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req, res, next) => {
    try {
        const { title, description, price, lectureTitles } = req.body;
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            throw createError(404, "Course not found");
        }

        // Update basic info
        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price || course.price;

        // Update thumbnail if provided
        if (req.files?.thumbnail) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.publicId);
            const thumbnailResult = await uploadThumbnail(req.files.thumbnail[0]);
            course.thumbnail = {
                url: thumbnailResult.url,
                publicId: thumbnailResult.publicId
            };
        }

        // Update lectures if provided
        if (req.files?.video) {
            // Delete old videos
            await Promise.all(course.lectures.map(lecture => 
                cloudinary.v2.uploader.destroy(lecture.videoPublicId, { resource_type: 'video' })
            ));

            // Upload new videos
            const newLectures = await Promise.all(req.files.video.map(async (videoFile, index) => {
                const videoResult = await uploadVideo(videoFile, course._id, index + 1);
                return {
                    title: lectureTitles[index] || `Lecture ${index + 1}`,
                    videoUrl: videoResult.playbackUrl || videoResult.url,
                    videoPublicId: videoResult.publicId
                };
            }));

            course.lectures = newLectures;
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (req, res, next) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            throw createError(404, "Course not found");
        }

        // Delete thumbnail from Cloudinary
        if (course.thumbnail.publicId) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.publicId);
        }

        // Delete all lecture videos from Cloudinary
        await Promise.all(course.lectures.map(lecture => 
            cloudinary.v2.uploader.destroy(lecture.videoPublicId, { resource_type: 'video' })
        ));

        await courseModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

