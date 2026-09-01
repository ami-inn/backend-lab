
import type { Request, Response, NextFunction } from "express";

import { NotFoundError } from "@/utils/error";

function notFoundHandler(_req: Request, _res: Response, _next: NextFunction) {
    throw new NotFoundError("Resource not found");
}

export default notFoundHandler;