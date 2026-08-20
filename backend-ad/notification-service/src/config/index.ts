import "dotenv/config";

const config = {
  SERVICE_NAME: process.env.SERVICE_NAME || "notification-service",
  PORT: Number(process.env.PORT || 4004),
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:3001"],
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || "localhost:9093").split(","),
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "notification-service",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
  MAIL_SEND: process.env.MAIL_SEND || "",
};

export default config;