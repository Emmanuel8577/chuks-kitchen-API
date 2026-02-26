import express from "express";
import { signup, verifyEmail, login, resendOTP } from "../controllers/auth.controller.js";



const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyEmail);
router.post("/resend-otp", resendOTP); // New route
router.post("/login", login);


export default router