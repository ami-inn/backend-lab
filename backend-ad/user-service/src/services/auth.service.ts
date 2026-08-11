import bcrypt from "bcrypt";

import { prisma } from "@/config/prisma";
import { SendOtpRequestBody } from "@/types/auth.types";
import { sendOtpEmail, sendAccountCreatedEmail } from "@/utils/email";
import { BadRequestError, ConflictError } from "@/utils/error";
import { generateAndStoreOtp, verifyOtp as verifyOtpValue } from "@/utils/otp";


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
    await sendOtpEmail(email, otp);
    // we send the send email in async way in the help of kafka or rabbitmq in production environment

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



export const authService = {
    sendOtp,
    verifyOtp,
};