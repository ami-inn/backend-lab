import { Request, Response } from "express";

import { userService } from "@/services/user.service";
import asyncHandler from "@/utils/asyncHandler";




export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    console.log("getProfile called");
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in request" });
    }



    const user = await userService.getProfile(userId);

    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
    });
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in request" });
    }

    const updateData = req.body;

    const updatedUser = await userService.updateProfile(userId, updateData);

    res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
    });
})

export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in request" });
    }

    await userService.deleteProfile(userId);

    res.status(200).json({
        success: true,
        message: "User profile deleted successfully",
    });
})