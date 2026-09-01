import express from "express";

import { login, sendOtp, verifyOtp,rotateRefreshToken } from "@/controllers/auth.controller";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post('/login',login)
router.get('/refresh', rotateRefreshToken); // This route will handle the refresh token logic

export default router;