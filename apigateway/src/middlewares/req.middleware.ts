import type { RequestHandler } from "express";

import logger from "@/config/logger";

const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${Date.now() - startedAt}ms`);
  });

  next();
};

export default requestLogger;