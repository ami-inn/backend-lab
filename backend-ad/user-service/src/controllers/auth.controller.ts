import { Request, Response } from "express";

import config from "@/config";
import { authService } from "@/services/auth.service";
import type { SendOtpRequestBody } from "@/types/auth.types";
import asyncHandler from "@/utils/asyncHandler";
import { BadRequestError } from "@/utils/error";

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  try {
    
  
  const { firstName, lastName, email, password, confirmPassword } = req.body as SendOtpRequestBody;

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError("Missing required fields: firstName, lastName, email, password");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("Password and confirm password do not match");
  }

  const { otpSessionId } = await authService.sendOtp({ firstName, lastName, email, password });

  //   store the otpsession id in cookie
  res
    .cookie("otpSessionId", otpSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(config.OTP_TTL) * 1000,
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Error in sendOtp controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
