import crypto from "crypto";

import jwt from "jsonwebtoken";

import config from "@/config";
import logger from "@/config/logger";

const JWT_SECRET = config.JWT_SECRET || "default_jwt_secret";

export const generateAccessToken = (userId: string): string => {
  const payload = {id: userId };
  const expiresIn = config.JWT_EXPIRATION as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };

  try {
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    logger.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

export const generateRefreshToken = (userId: string): string => {
  const payload = { id: userId,jti: crypto.randomUUID() }; // Include a unique identifier (jti) for the refresh token
  const expiresIn = "7d"; // Refresh token valid for 7 days
  const options: jwt.SignOptions = { expiresIn };

  try {
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    logger.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};


export const verifyAccessToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    logger.error("Error verifying access token:", error);
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): { id: string; jti: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; jti: string };
    return decoded;
  } catch (error) {
    logger.error("Error verifying refresh token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};