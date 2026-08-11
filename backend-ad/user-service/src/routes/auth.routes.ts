import express from "express";

import { sendOtp } from "@/controllers/auth.controller";

const router = express.Router();

router.post("/send-otp", sendOtp);

export default router;