import sgMail from "@sendgrid/mail";

import config from "@/config";

import { InternalServerError } from "./error";
import "dotenv/config";

interface SendGridErrorResponse {
  response?: {
    body?: unknown;
  };
  code?: number;
}

function getSendGridErrorDetails(error: unknown): SendGridErrorResponse {
  if (error && typeof error === "object") {
    const maybeError = error as Partial<SendGridErrorResponse> & {
      response?: { body?: unknown };
      code?: number;
    };

    return {
      response: {
        body: maybeError.response?.body,
      },
      code: maybeError.code,
    };
  }

  return {};
}

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  throw new Error("SENDGRID_API_KEY is not configured");
}

if (!process.env.MAIL_SEND) {
  throw new Error("MAIL_SEND is not configured");
}

sgMail.setApiKey(apiKey);

const minutes = (Number(config.OTP_TTL) || 300) / 60;

const fromEmail = process.env.MAIL_SEND;

async function sendOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: {
      email: fromEmail,
      name: "IRCTC",
    },
    subject: "Your OTP for IRCTC",
    text: `Your OTP is ${otp}. It will expire in ${minutes} minutes.`,
    html: `
      <strong>
        Your OTP is ${otp}. It will expire in ${minutes} minutes.
      </strong>
    `,
  };

  try {
    console.log("Sending email:", {
      to,
      from: fromEmail,
    });

    await sgMail.send(msg);

    console.log("OTP email sent successfully");
  } catch (error: unknown) {
    const errorDetails = getSendGridErrorDetails(error);

    console.error(
      "SENDGRID ERROR:",
      JSON.stringify(errorDetails.response?.body, null, 2)
    );

    console.error("SENDGRID STATUS:", errorDetails.code);

    throw new InternalServerError("Failed to send OTP email");
  }
}

async function verifyOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: {
      email: fromEmail,
      name: "IRCTC",
    },
    subject: "Your OTP Verification for IRCTC",
    text: `Your OTP is ${otp}. It will expire in ${minutes} minutes.`,
    html: `
      <strong>
        Your OTP is ${otp}. It will expire in ${minutes} minutes.
      </strong>
    `,
  };

  try {
    await sgMail.send(msg);

    console.log("OTP verification email sent successfully");
  } catch (error: unknown) {
    const errorDetails = getSendGridErrorDetails(error);

    console.error(
      "SENDGRID ERROR:",
      JSON.stringify(errorDetails.response?.body, null, 2)
    );

    console.error("SENDGRID STATUS:", errorDetails.code);

    throw new InternalServerError(
      "Failed to send OTP verification email"
    );
  }
}

export { sendOtpEmail, verifyOtpEmail };