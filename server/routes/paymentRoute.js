import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", requireSignIn, createOrder);
router.post("/verify-payment", requireSignIn, verifyPayment);

export default router;