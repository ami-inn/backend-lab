import bcrypt from "bcrypt";

import { prisma } from "@/config/prisma";
import { SendOtpRequestBody } from "@/types/auth.types";
import { sendOtpEmail } from "@/utils/email";
import { ConflictError } from "@/utils/error";
import { generateAndStoreOtp } from "@/utils/otp";


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



export const authService = {
    sendOtp,
};