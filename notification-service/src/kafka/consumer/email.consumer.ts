import { consumer } from "@/config/kafka";
import logger from "@/config/logger";
import emailService from "@/services/email.services";
import { TOPICS } from "@/utils/constants";

interface OtpEmailMessage {
    email: string;
    otp: string;
    ttlInSeconds: number;
}

interface WelcomeEmailMessage {
    email: string;
}

const parseMessage = <T>(value: string): T | null => {
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};

class EmailConsumer {

    async handleOtpEmail(value: string): Promise<void> {
        const message = parseMessage<OtpEmailMessage>(value);
        if (!message || !message.email || !message.otp || !Number.isFinite(message.ttlInSeconds) || message.ttlInSeconds <= 0) {
            throw new Error(`Invalid OTP email message: ${value}`);
        }

        await emailService.sendOtpEmail(message.email, message.otp, message.ttlInSeconds);
        logger.info(`OTP email sent to ${message.email}`);
    }

    async handleWelcomeEmail(value: string): Promise<void> {
        const message = parseMessage<WelcomeEmailMessage>(value);
        if (!message || !message.email) {
            throw new Error(`Invalid welcome email message: ${value}`);
        }

        await emailService.sendWelcomeEmail(message.email);
        logger.info(`Welcome email sent to ${message.email}`);
    }

    async handleMessage(topic: string, value: string): Promise<void> {
        switch (topic) {
            case TOPICS.OTP_EMAIL:
                await this.handleOtpEmail(value);
                break;
            case TOPICS.WELCOME_EMAIL:
                await this.handleWelcomeEmail(value);
                break;
            default:
                logger.warn(`No handler for topic ${topic}`);
        }
    }

    async start(): Promise<void> {
        try {
            await consumer.connect();
            logger.info('EmailConsumer connected to Kafka successfully');

            await consumer.subscribe({ topics: Object.values(TOPICS), fromBeginning: false });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const key = message.key?.toString() || '';
                    const value = message.value?.toString() || '';
                    logger.info(`Received message from topic ${topic} with key ${key}: ${value}, partition: ${partition}`);

                    await this.handleMessage(topic, value);
                },
            });
        } catch (error) {
            logger.error(`Error starting EmailConsumer: ${error}`);
            throw error;
        }
    }
}

export default new EmailConsumer();