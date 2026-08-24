import Redis from "ioredis";

import logger from "./logger";

import config from ".";

const redisUrl = config.REDIS_URL;

class RedisClient {
  static instance: Redis | null = null;
  static isConnected: boolean = false;

  constructor() {}

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          logger.warn(`Redis connection lost. Retrying in ${delay}ms...`);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });
      RedisClient.setupEventListeners();
    }

    return RedisClient.instance;
  }

  static setupEventListeners() {
    if (!RedisClient.instance) {
      return;
    }

    RedisClient.instance.on("connect", () => {
      RedisClient.isConnected = true;
      logger.info("Redis connected");
    });

    RedisClient.instance.on("error", (err: Error) => {
      RedisClient.isConnected = false;
      logger.error(`Redis error: ${err}`);
    });

    RedisClient.instance.on("close", () => {
      RedisClient.isConnected = false;
      logger.warn("Redis connection closed");
    });
  }
}

const redis = RedisClient.getInstance();

export { redis };
export default RedisClient;
