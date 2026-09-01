import crypto from "crypto";

import jwt from "jsonwebtoken";

import config from "@/config";
import logger from "@/config/logger";

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;
const JWT_EXPIRATION = config.JWT_ACCESS_EXPIRATION;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRATION = config.JWT_REFRESH_EXPIRATION;

export const generateAccessToken = (userId: string): string => {
  const payload = {id: userId };
  const expiresIn = JWT_EXPIRATION as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };

  try {
    return jwt.sign(payload, JWT_ACCESS_SECRET, options);
  } catch (error) {
    logger.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

export const generateRefreshToken = (userId: string): string => {
  const payload = { id: userId,jti: crypto.randomUUID() }; // Include a unique identifier (jti) for the refresh token
  const expiresIn = JWT_REFRESH_EXPIRATION as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };

  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  } catch (error) {
    logger.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};


export const verifyAccessToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    logger.error("Error verifying access token:", error);
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): { id: string; jti: string } => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string; jti: string };
    return decoded;
  } catch (error) {
    logger.error("Error verifying refresh token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};