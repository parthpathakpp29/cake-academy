import courseModel from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import { uploadFile, deleteFile, getSignedUrlForVideo } from "../utils/s3.js";
import fs from 'fs/promises';
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
        thumbnailResult = await uploadFile(req.files.thumbnail[0], "courses/thumbnails");

        // Process videos if present
        if (req.files.video) {
            lectureResults = await Promise.all(req.files.video.map(async (videoFile, index) => {
                const lectureTitle = lectureTitles[index] || `Lecture ${index + 1}`;
                const videoResult = await uploadFile(videoFile, `courses/${req.user._id}/lectures`);
                return {
                    title: lectureTitle,
                    videoUrl: videoResult.url,
                    videoKey: videoResult.key,
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
                key: thumbnailResult.key,
            },
            lectures: lectureResults,
            instructor: req.user._id,
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
        if (thumbnailResult?.key) {
            await deleteFile(thumbnailResult.key);
        }
        for (const lecture of lectureResults) {
            if (lecture.videoKey) {
                await deleteFile(lecture.videoKey);
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

        // Generate signed URLs for video lectures
        course.lectures = await Promise.all(course.lectures.map(async (lecture) => ({
            ...lecture,
            videoUrl: await getSignedUrlForVideo(lecture.videoKey)
        })));

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
            await deleteFile(course.thumbnail.key);
            const thumbnailResult = await uploadFile(req.files.thumbnail[0], "courses/thumbnails");
            course.thumbnail = {
                url: thumbnailResult.url,
                key: thumbnailResult.key
            };
        }

        // Update lectures if provided
        if (req.files?.video) {
            // Delete old videos
            await Promise.all(course.lectures.map(lecture => 
                deleteFile(lecture.videoKey)
            ));

            // Upload new videos
            const newLectures = await Promise.all(req.files.video.map(async (videoFile, index) => {
                const videoResult = await uploadFile(videoFile, `courses/${course._id}/lectures`);
                return {
                    title: lectureTitles[index] || `Lecture ${index + 1}`,
                    videoUrl: videoResult.url,
                    videoKey: videoResult.key
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

        // Delete thumbnail from S3
        if (course.thumbnail.key) {
            await deleteFile(course.thumbnail.key);
        }

        // Delete all lecture videos from S3
        await Promise.all(course.lectures.map(lecture => 
            deleteFile(lecture.videoKey)
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

export const checkEnrollment = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "completed"
        });

        res.json({
            success: true,
            isEnrolled: !!enrollment
        });
    } catch (error) {
        next(createError(500, "Error checking enrollment status"));
    }
};

export const getUserPurchases = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const purchases = await Enrollment.find({ user: userId, status: "completed" })
            .populate('course', 'title description price')
            .sort({ createdAt: -1 })
            .lean();

        const formattedPurchases = purchases.map(purchase => ({
            _id: purchase._id,
            course: {
                _id: purchase.course._id,
                title: purchase.course.title,
                description: purchase.course.description,
            },
            amount: purchase.course.price,
            purchaseDate: purchase.createdAt
        }));

        res.status(200).json({
            success: true,
            purchases: formattedPurchases
        });
    } catch (error) {
        next(createError(500, "Error fetching user purchases"));
    }
};

