import cors from "cors";

import config from "@/config";

const corsMiddleware = cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization","Origin", "X-Requested-With", "Accept"],
});

export default corsMiddleware;