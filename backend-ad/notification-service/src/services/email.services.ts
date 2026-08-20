
import sgMail, { type MailDataRequired } from "@sendgrid/mail";

import config from "@/config";
import logger from "@/config/logger";
import { getOtpTemplate, getWelcomeTemplate } from "@/templates";

class EmailService {
    private readonly from: string;
    private readonly maxRetries = 3;

    constructor() {
        if (config.SENDGRID_API_KEY) {
            sgMail.setApiKey(config.SENDGRID_API_KEY);
        }

        this.from = config.MAIL_SEND;
    }

    async sendWithRetry(msg: MailDataRequired, recipient: string, retries = 0): Promise<void> {
        if (!this.from || !config.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY and MAIL_SEND must be configured");
        }

        try {
            await sgMail.send(msg);
            logger.info(`Email sent successfully to ${recipient}`);

        } catch (error) {
            logger.error(`Failed to send email to ${recipient}: ${error}`);
            if (retries < this.maxRetries - 1) {
                logger.info(`Retrying to send email to ${recipient}. Attempt ${retries + 1}`);
                const delay = Math.pow(2, retries) * 1000;
                await new Promise<void>((resolve) => setTimeout(resolve, delay));
                return this.sendWithRetry(msg, recipient, retries + 1);
            }

            logger.error(`Max retries reached. Could not send email to ${recipient}`);
            throw error;
        }
    }

    async sendOtpEmail(to: string, otp: string, ttlInSeconds: number): Promise<void> {
        const msg = {
            to,
            from: this.from,
            subject: "Your verification code for IRCTC",
            text: `Your OTP is ${otp}. It expires in ${Math.ceil(ttlInSeconds / 60)} minutes.`,
            html: getOtpTemplate(otp, ttlInSeconds),
        };

        await this.sendWithRetry(msg, to);
    }

    async sendWelcomeEmail(to: string): Promise<void> {
        const msg = {
            to,
            from: this.from,
            subject: "Welcome to IRCTC",
            text: "Your account has been created successfully.",
            html: getWelcomeTemplate(),
        };

        await this.sendWithRetry(msg, to);
    }
}

export default new EmailService();