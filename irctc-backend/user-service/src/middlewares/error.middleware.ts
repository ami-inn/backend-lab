
import { Request, Response, NextFunction } from "express";

import { AppError } from "@/utils/asyncHandler";



module.exports = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    
    if(err instanceof AppError){
        return res.status(err.statusCode as number).json({
            success: false,
            error:err.code,
            message: err.message,
            stack: err.stack
        });
    }
    console.error('unhandled error',err);
    return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
        
    });
};