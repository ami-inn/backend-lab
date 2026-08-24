// end point specific rate limiting middleware
// example post /api/v1/auth/send-otp should be limited to 5 requests per hour
import { Request, Response, NextFunction } from "express";
import logger from "@/config/logger";
import { redis } from "@/config/redis";


import { TooManyRequestsError } from "@/utils/error";



//rate limiting strategies
//1 ip based rate limiting
//2 user based rate limiting
//3 endpoint based rate limiting


const rateLimiter = async (key: string, maxRequests: number, windowMs: number) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  try {

    // use redis pipeline for atomic operations
    const pipeline = redis.pipeline();

    // remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart); // remove old requests

    // add the current request
    pipeline.zadd(key, now, now.toString());
    // set the expiration for the key
    pipeline.expire(key, Math.ceil(windowMs / 1000));
    const execResult = await pipeline.exec();
    const requestCount = await redis.zcard(key);
    if (requestCount > maxRequests) {
      throw new TooManyRequestsError("Too many requests");
    }
  } catch (error) {
    console.error("Error in rateLimiter:", error);
    throw error;
  }
};

export const rateLimitMiddleware = (maxRequests: number, windowMs: number) => {
  const requestCounts: Record<string, { count: number; timestamp: number }> = {};


  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress;
    const endPoint = `${req.method}:${req.path}`;
    const key = `ratelimit:endpoint:${endPoint}:${ip}`;

    const result = await rateLimiter(key, maxRequests, windowMs);

  };
};