import express from "express";
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    resetPasswordController,
    getTotalUsersController,
    getAllUsersController
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => res.status(200).json({ ok: true }));
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => res.status(200).json({ ok: true }));
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/total-users", requireSignIn, isAdmin, getTotalUsersController);
router.get("/users", requireSignIn, isAdmin, getAllUsersController);


export default router;