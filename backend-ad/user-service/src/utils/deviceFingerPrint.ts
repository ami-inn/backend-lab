import crypto from "crypto";

import type { Request } from "express";

export function getDeviceFingerprint(req: Request): string {
  const userAgent = req.headers["user-agent"] || "";
  const accept = req.headers["accept"] || "";
  const ipAddress = req.ip || req.connection.remoteAddress || "";

  const raw = `${userAgent}|${accept}|${ipAddress}`;

  return crypto.createHash("sha256").update(raw).digest("hex");


}

// this function generates a unique device fingerprint based on the request headers and IP address. It uses the SHA-256 hashing algorithm to create a hash of the concatenated string of user-agent, accept header, and IP address. This fingerprint can be used for various purposes, such as identifying unique devices or sessions in a web application.

//its useful for security purposes, such as preventing fraud or abuse, and can also be used for analytics and tracking user behavior across different devices.