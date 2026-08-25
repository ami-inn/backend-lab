import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/utils/error";

export const getUserContext = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("🔥 getUserContext middleware called");

    console.log("🔥 Incoming headers:", req.headers);

    const userId = req.headers["x-user-id"] as string | undefined;

    console.log("🔥 Extracted userId:", userId);

    if (!userId) {
        console.log("❌ x-user-id is missing");

        return next(
            new UnauthorizedError("Missing required header: x-user-id")
        );
    }

    req.user = {
        id: userId,
    };

    console.log("✅ User context attached:", req.user);

    next();
};