import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "@/config";
import { authService } from "@/services/auth.service";
import type { SendOtpRequestBody } from "@/types/auth.types";
import asyncHandler from "@/utils/asyncHandler";
import { getDeviceFingerprint } from "@/utils/deviceFingerPrint";
import { BadRequestError } from "@/utils/error";

const getTokenMaxAge = (token: string): number => {
  const payload = jwt.decode(token);

  if (typeof payload !== "object" || payload === null || typeof payload.exp !== "number") {
    throw new Error("Token is missing an expiration claim");
  }

  return Math.max(0, payload.exp * 1000 - Date.now());
};

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



export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  console.log("Received request body:", req.body);

  const { otp } = req.body as { otp?: string };
  const otpSessionId = req.cookies?.otpSessionId as string | undefined;

  console.log("Received OTP:", otp);
  console.log("Received OTP Session ID from cookie:", otpSessionId);

  if (!otp || !otpSessionId) {
    throw new BadRequestError("Missing required fields: otp, otpSessionId");
  }

  const user = await authService.verifyOtp(otp, otpSessionId);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: user,
  });
});



export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    throw new BadRequestError("Missing required fields: email, password");
  }
  const deviceId =getDeviceFingerprint(req);



  const {accessToken,refreshToken,loggedInUser} = await authService.login({ email, password, deviceId });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: getTokenMaxAge(refreshToken),
    sameSite: "strict",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: getTokenMaxAge(accessToken),
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      loggedInUser,
    },
  });
});