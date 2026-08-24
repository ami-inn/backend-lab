import type { ErrorRequestHandler } from "express";

import logger from "@/config/logger";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error(error.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;