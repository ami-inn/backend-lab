import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";

import errorHandler from "@/middlewares/error.middleware";

import config from "./config";
import logger from "./config/logger";
import corsMiddleware from "./middlewares/cors.middleware";
import reqLogger from "./middlewares/req.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();
console.log("User Service is running");
app.use(helmet());
console.log("User Service is running1");
app.use(corsMiddleware);
console.log("User Service is running2");
app.use(express.json());
console.log("User Service is running3");
app.use(cookieParser());
console.log("User Service is running4");
app.use(reqLogger);
console.log("User Service is running5");
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.get("/", (_req, res) => {
  res.send("User Service is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
