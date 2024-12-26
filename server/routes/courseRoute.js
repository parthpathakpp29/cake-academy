import express from "express";
import { createCourse, getAllCourses, getCourseById, deleteCourse, checkEnrollment, getUserPurchases, addLectureToCourse, deleteLecture, updateCourse } from "../controllers/courseController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create course - only admin can create
router.post(
    "/create-course",
    requireSignIn,
    isAdmin,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 10 }
    ]),
    createCourse
);

// Get all courses - public route
router.get("/get-courses", getAllCourses);

// Get single course - public route
router.get("/get-course/:id", getCourseById);

// Delete course - admin only
router.delete("/delete-course/:id", requireSignIn, isAdmin, deleteCourse);

// Check enrollment status
router.get("/check-enrollment/:courseId", requireSignIn, checkEnrollment);

router.get("/user-purchases", requireSignIn, getUserPurchases);

// Add new lecture to existing course
router.post(
    "/add-lecture/:courseId",
    requireSignIn,
    isAdmin,
    upload.fields([
        { name: "video", maxCount: 1 }
    ]),
    addLectureToCourse
);

// Delete specific lecture
router.delete(
    "/delete-lecture/:courseId/:lectureId",
    requireSignIn,
    isAdmin,
    deleteLecture
);

// Add this route
router.patch(
    "/update-course/:id",
    requireSignIn,
    isAdmin,
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    updateCourse
);

export default router;