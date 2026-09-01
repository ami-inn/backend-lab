import "dotenv/config";

const config = {
  SERVICE_NAME: process.env.SERVICE_NAME || "apigateway",
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:3001"],
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:4001",
  ADMIN_SERVICE_URL: process.env.ADMIN_SERVICE_URL || "http://localhost:4006",
  PAYMENT_SERVICE_URL:
    process.env.PAYMENT_SERVICE_URL || "http://localhost:4002",
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL || "http://localhost:4003",
  NOTIFICATION_SERVICE_URL:
    process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4004",
  BOOKING_SERVICE_URL:
    process.env.BOOKING_SERVICE_URL || "http://localhost:4005",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  SERVICE_TIMEOUT_MS: Number(process.env.SERVICE_TIMEOUT_MS || 10000),
  CIRCUIT_BREAKER_THRESHOLD: Number(process.env.CIRCUIT_BREAKER_THRESHOLD || 5),
  CIRCUIT_BREAKER_TIMEOUT: Number(process.env.CIRCUIT_BREAKER_TIMEOUT || 30000),

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};

export default config;
