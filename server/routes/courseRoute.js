import express from "express";
import { createCourse, getAllCourses, getCourseById, deleteCourse, checkEnrollment, getUserPurchases } from "../controllers/courseController.js";
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


export default router;