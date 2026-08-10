import config from "@/config";
import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const minutes = (config.OTP_TTL as number || 300) / 60;

async function sendOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: `${config.MAIL_SEND}`, // Use the email address or domain you verified with SendGrid
    subject: "Your OTP for IRCTC",
    text: `Your OTP is ${otp}. It will expire in ${minutes} minutes.`,
    html: `<strong>Your OTP is ${otp}. It will expire in ${minutes} minutes.</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

async function verifyOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: `${config.MAIL_SEND}`, // Use the email address or domain you verified with SendGrid
    subject: "Your OTP Verification for IRCTC",
    text: `Your OTP is ${otp}. It will expire in ${minutes} minutes.`,
    html: `<strong>Your OTP is ${otp}. It will expire in ${minutes} minutes.</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log("OTP verification email sent successfully");
  } catch (error) {
    console.error("Error sending OTP verification email:", error);
  }
}

export { sendOtpEmail, verifyOtpEmail };

