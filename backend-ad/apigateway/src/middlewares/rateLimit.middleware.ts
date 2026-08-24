import type { NextFunction, Request, Response } from "express";

import { redis } from "@/config/redis";
import { TooManyRequestsError } from "@/utils/error";

const applyRateLimit = async (key: string, maxRequests: number, windowMs: number): Promise<void> => {
  const now = Date.now();
  const windowStart = now - windowMs;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, `${now}`);
  pipeline.expire(key, Math.ceil(windowMs / 1000));
  pipeline.zcard(key);

  const result = await pipeline.exec();
  const zcardReply = result?.[3]?.[1];
  const requestCount = typeof zcardReply === "number" ? zcardReply : Number(zcardReply ?? 0);

  if (requestCount > maxRequests) {
    throw new TooManyRequestsError("Too many requests");
  }
};

const rateLimitMiddleware = (prefix: string, maxRequests: number, windowMs: number) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const key = `${prefix}:${req.method}:${req.path}:${ip}`;
      await applyRateLimit(key, maxRequests, windowMs);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const ipRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimitMiddleware("ratelimit:ip", maxRequests, windowMs);
};

export const endpointRateLimit = (maxRequests = 20, windowMs = 15 * 60 * 1000) => {
  return rateLimitMiddleware("ratelimit:endpoint", maxRequests, windowMs);
};

export const combinedRateLimit = (
  ipMaxRequests = 100,
  endpointMaxRequests = 20,
  windowMs = 15 * 60 * 1000,
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      await applyRateLimit(`ratelimit:ip:${req.method}:${req.path}:${ip}`, ipMaxRequests, windowMs);
      await applyRateLimit(`ratelimit:endpoint:${req.method}:${req.path}:${ip}`, endpointMaxRequests, windowMs);
      next();
    } catch (error) {
      next(error);
    }
  };
};
