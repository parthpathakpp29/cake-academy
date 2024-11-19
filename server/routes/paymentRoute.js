import express from "express";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";
import { createOrder, getTotalRevenueController, verifyPayment } from "../controllers/paymentController.js";


const router = express.Router();

router.post("/create-order", requireSignIn, createOrder);
router.post("/verify-payment", requireSignIn, verifyPayment);
router.get("/total-revenue", requireSignIn, isAdmin, getTotalRevenueController);

export default router;