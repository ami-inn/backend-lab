import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import config from "@/config";
import logger from "@/config/logger";
import corsMiddleware from "@/middlewares/cors.middleware";
import errorHandler from "@/middlewares/error.middleware";
import requestLogger from "@/middlewares/req.middleware";
import gatewayRoutes from "@/routes/gateway.routes";

import notFound from "./middlewares/notFound.middleware";


const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(morgan("combined"));

app.use("/api/v1", gatewayRoutes);

app.get("/", (_req, res) => {
  res.send("API Gateway is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
});

const gracefulShutdown = () => {
  logger.info("Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Forcing shutdown...");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
