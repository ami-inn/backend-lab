
import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown> | void;

const asyncHandler = (fn: AsyncHandler) => {
  console.log("asyncHandler called with function:", fn.name || "anonymous function");
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;