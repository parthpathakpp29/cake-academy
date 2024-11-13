import express from "express";

import { createCourse, getAllCourses, getCourseById, deleteCourse } from "../controllers/courseController.js";
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
        { name: "video", maxCount: 10 } // Allow up to 10 video files
    ]),
    createCourse
);


// Get all courses - public route
router.get("/get-courses", getAllCourses);

// Get single course - public route
router.get("/get-course/:id", getCourseById);

// // Update course - admin only
// router.put(
//     "/update-course/:id",
//     upload.fields([
//         { name: "thumbnail", maxCount: 1 },
//         { name: "video", maxCount: 1 }
//     ]),
//     updateCourse
// );

// Delete course - admin only
router.delete("/delete-course/:id", deleteCourse);

export default router;