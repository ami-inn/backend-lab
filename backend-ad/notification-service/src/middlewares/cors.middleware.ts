import cors from "cors";

import config from "@/config";

const corsMiddleware = cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
});

export default corsMiddleware;