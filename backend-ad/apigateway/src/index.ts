import express from "express";
import helmet from "helmet";

import config from "@/config";
import logger from "@/config/logger";
import corsMiddleware from "@/middlewares/cors.middleware";
import errorHandler from "@/middlewares/error.middleware";
import requestLogger from "@/middlewares/req.middleware";
import gatewayRoutes from "@/routes/gateway.routes";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);

app.use("/api/v1", gatewayRoutes);

app.get("/", (_req, res) => {
  res.send("API Gateway is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
});