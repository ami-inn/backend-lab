
import type { Request, Response, NextFunction } from "express";

import { NotFoundError } from "@/utils/error";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    throw new NotFoundError("Resource not found");
}

export default notFoundHandler;