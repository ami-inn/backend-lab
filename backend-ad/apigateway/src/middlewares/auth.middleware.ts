import {Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "@/utils/auth";
import { UnauthorizedError } from "@/utils/error";

type AuthenticatedRequest = Request & {
    user?: {
        id: string | number;
    };
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log("requireAuth middleware called");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authorization header missing or malformed");
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(accessToken);
        const authenticatedReq = req as AuthenticatedRequest;

        // // Attach the decoded user information to the request object for further use
        // authenticatedReq.user = decoded;
        // next();

        authenticatedReq.user = {
            id: payload.id,
        }; // Assuming the payload contains user information

        

        console.log("Authenticated user ID:", payload.id);
        next();
    } catch (error) {
        console.error("Error in requireAuth middleware:", error);
        throw new UnauthorizedError("Invalid or expired access token");
    }
};