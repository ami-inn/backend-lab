import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import config from "@/config";
import logger from "@/config/logger";
import { prisma } from "@/config/prisma";
import { redis } from "@/config/redis";
import notificationProducer from "@/kafka/producer/notification.producer";
import { SendOtpRequestBody } from "@/types/auth.types";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/auth";
import { sendAccountCreatedEmail } from "@/utils/email";
import { BadRequestError, ConflictError, ForbiddenError } from "@/utils/error";
import { generateAndStoreOtp, verifyOtp as verifyOtpValue } from "@/utils/otp";

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

 const sendOtp = async ({
  firstName,
  lastName,
  email,
  password,
}: SendOtpRequestBody) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    

    const hashedPassword = await bcrypt.hash(password!, 12);
    const meta = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const {otp,otpSessionId} = await generateAndStoreOtp(meta);

    //send otp to user via email or sms
    // await sendOtpEmail(email, otp);
    // we send the send email in async way in the help of kafka or rabbitmq i)n production environment
    await notificationProducer.sendOtpEmail(email, otp, (config.OTP_TTL / 60));
    logger.info(`OTP for ${email} queued successfully`);
    return {
      otpSessionId,
    };
};


const verifyOtp = async (otp: string, otpSessionId: string) => {
  const meta = await verifyOtpValue(otp, otpSessionId);
  console.log("Meta after OTP verification:", meta);

  if (meta == null) {
    throw new BadRequestError("Invalid OTP or OTP has expired");
  }

  const user = await prisma.user.create({
    data: {
      firstName: meta.firstName ?? "",
      lastName: meta.lastName ?? "",
      email: meta.email,
      password: meta.password!,
      emailVerified: true,
    },
  });

  await sendAccountCreatedEmail(meta.email);

  return user;
};

const login = async ({ email, password, deviceId }: { email: string; password: string; deviceId: string }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }

  // Here you can generate access and refresh tokens using your auth utility functions
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const {jti} = jwt.decode(refreshToken) as { jti: string }; // Extract the jti from the refresh token

  // Store the refresh token in redis
  await redis.set(`refresh:${user.id}:${deviceId}`, jti, 'EX', config.JWT_REFRESH_EXPIRES_IN);
  const loggedInUser = Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password"),
  );
  await redis.set(`user:${user.id}`, JSON.stringify(loggedInUser), 'EX', config.REDIS_TTL);
  


  return {
    accessToken,
    refreshToken,
    loggedInUser: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };

}


const rotateRefreshToken = async (refreshToken: string, deviceId: string) => {
  const {id: userId,jti} = verifyRefreshToken(refreshToken);

  const storedJti = await redis.get(`refresh:${userId}:${deviceId}`);

  if (!storedJti ) {
    throw new ForbiddenError("Session expired or invalid. Please log in again.");
  }
  if (storedJti !== jti) {
    await redis.del(`refresh:${userId}:${deviceId}`); // Invalidate the old refresh token
    throw new ForbiddenError("Refresh token has been rotated or is invalid. Please log in again. ");
  }

  // Generate new access and refresh tokens
  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  const { jti: newJti } = jwt.decode(newRefreshToken) as { jti: string };

  // Store the new refresh token in redis
  await redis.set(`refresh:${userId}:${deviceId}`, newJti, 'EX', config.JWT_REFRESH_EXPIRES_IN);

  return {
    newAccessToken,
    newRefreshToken
  };
};

const verifyGoogleIdToken = async (idToken: string, deviceId: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.GOOGLE_CLIENT_ID,

  });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new BadRequestError("Invalid Google ID token");
  }
 const googleUser = {
    provider: payload.iss,
    providerId: payload.sub,
    email: payload.email,
    firstName: payload.given_name || "",
    lastName: payload.family_name || "",
    emailVerified: payload.email_verified || false,
  
 };


 //transaction using here

 const user = await prisma.$transaction(async (tx) => {
    const googleAuth = await tx.authProvider.findUnique({
      where:{
        provider_providerId: {
          provider: googleUser.provider,
          providerId: googleUser.providerId,
        },
      },
      include: {
        user: true,
      },
    })

    if(googleAuth) {
      return googleAuth.user;
    } else {
      // Check if a user with the same email already exists
      const existingUser = await tx.user.findUnique({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        await tx.authProvider.create({
          data: {
            provider: googleUser.provider,
            providerId: googleUser.providerId,
            userId: existingUser.id,
          },
        });
        return existingUser;
      }

      // Create a new user and authProvider entry
      const newUser = await tx.user.create({
        data: {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          emailVerified: googleUser.emailVerified,
          AuthProvider: {
            create: {
              provider: googleUser.provider,
              providerId: googleUser.providerId,
            },
          },
        },
      });

  

      return newUser;
    }


  });

  //access token and refresh token generte

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const { jti } = jwt.decode(refreshToken) as { jti: string }; // Extract the jti from the refresh token

  // Store the refresh token in redis
  await redis.set(`refresh:${user.id}:${deviceId}`, jti, 'EX', config.JWT_REFRESH_EXPIRES_IN);
  const loggedInUser = Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password"),
  );
  await redis.set(`user:${user.id}`, JSON.stringify(loggedInUser), 'EX', config.REDIS_TTL);
  


  return {
    accessToken,
    refreshToken,
    loggedInUser: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  }


};

export const authService = {
    sendOtp,
    verifyOtp,
    login,
    rotateRefreshToken,
    verifyGoogleIdToken
};