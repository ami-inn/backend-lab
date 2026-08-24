

import jwt from "jsonwebtoken";

import config from "@/config";
import logger from "@/config/logger";

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;


export const verifyAccessToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    logger.error("Error verifying access token:", error);
    throw new Error("Invalid or expired access token");
  }
};