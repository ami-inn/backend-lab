
import crypto from "crypto";
// generate otp and store it in redis with a ttl of 5 minutes
// 1 user 1 hour 5 limit of otp generation

import OtpGenerator from "otp-generator";

import config from "@/config";
import { redis } from "@/config/redis";

import { TooManyRequestsError } from "./error";


const RATE_MAX = parseInt(config.OTP_RATE_MAX_PER_HOUR as string, 5) || 5; // Maximum number of OTP requests allowed per hour
const HMAC_SECRET = config.HMAC_SECRET || "default_secret"; // Secret key for HMAC generation

const hmacFor = (email: string, otp: string) => {
    return crypto.createHmac("sha256", HMAC_SECRET).update(`${email}:${otp}`).digest("hex");
}

// 6th time onwards user will get error message "You have exceeded the maximum number of OTP requests. Please try again after 1 hour."
export const generateAndStoreOtp = async (meta: { firstName?: string; lastName?: string; email: string; password?: string }) => {
    const rateKey = `otp_rate:${meta.email}`;
    const sentCount = parseInt(await redis.get(rateKey) || "0", 10);
    if(sentCount >= RATE_MAX) {
        throw new TooManyRequestsError("You have exceeded the maximum number of OTP requests. Please try again after 1 hour.");
    }
    const otp = OtpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
   const otpSessionId = crypto.randomUUID();
   const hashed = hmacFor(meta.email, otp);
   redis.set(`otp:session:${otpSessionId}`, JSON.stringify({ ...meta, hashedOtp: hashed }), "EX", parseInt(config.OTP_TTL as string, 10) || 300);

   await redis.incr(rateKey);
   await redis.expire(rateKey, 3600); // Set the expiration time for the rate limit key to 1 hour

   return { otp, otpSessionId };

}
