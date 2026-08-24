
import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "@/utils/error";


export const getUserContext = (req: Request,res:Response,next: NextFunction) => {

    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return new UnauthorizedError("Missing required header: x-user-id");
    }

    req.user = { id: userId };

    next();

}