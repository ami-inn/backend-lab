import jwt from "jsonwebtoken";

import config from "@/config";
import logger from "@/config/logger";

const JWT_SECRET = config.JWT_SECRET || "default_jwt_secret";

export const generateAccessToken = (userId: string): string => {
  const payload = { userId };
  const expiresIn = config.JWT_EXPIRATION as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };

  try {
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    logger.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};