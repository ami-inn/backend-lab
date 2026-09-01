import winston from "winston";

import config from ".";


const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { service: config.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message,service }) => {
      return `${timestamp} [${level.toUpperCase()}] [${service}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;