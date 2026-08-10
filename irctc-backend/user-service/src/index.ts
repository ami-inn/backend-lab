import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";

import errorHandler from "@/middlewares/error.middleware";
import { env } from "@/utils/env";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Hello Node + TypeScript");
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log("Server running on http://localhost:" + env.port);
});
