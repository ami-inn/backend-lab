import express from "express";

import { env } from "@/utils/env";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello Node + TypeScript");
});

app.listen(env.port, () => {
  console.log("Server running on http://localhost:" + env.port);
});
