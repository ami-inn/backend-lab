import express from "express";

import { login, sendOtp, verifyOtp } from "@/controllers/auth.controller";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post('/login',login)

export default router;