import { connectProducer, producer } from "@/config/kafka";
import logger from "@/config/logger";
import { TOPICS } from "@/utils/constants";

import type { NotificationMessageByTopic, NotificationTopic } from "@/types/notification.types";


// this will prevent multiple connections to kafka producer

class NotificationProducer {
    constructor(){
        this.isInitiated = false;
    }

    isInitiated: boolean;

    async initialize() {
        if(!this.isInitiated){
            await connectProducer();
            this.isInitiated = true;
        }
    }

    async sendMessage<T extends NotificationTopic>(
        topic: T,
        key: string,
        message: NotificationMessageByTopic[T],
    ) {
        await this.initialize();
        try {
            const result = await producer.send({
                topic,
                messages: [
                    { key:key||`${topic}-${Date.now()}`, value: JSON.stringify(message) },
                ],
            });
            logger.info(`Message sent to topic ${topic} with key ${key}`);
            // const result = await producer.send(message);
            //  logger.info(`Message sent to topic ${topic} with key ${key}: ${JSON.stringify(result)}, partition: ${result[0].partition}, offset: ${result[0].baseOffset}`);
            return result;
        } catch (error) {
            logger.error(`Failed to send message to topic ${topic} with key ${key}: ${error}`);
            throw error;
        }
    }

    async sendOtpEmail(email: string, otp: string, ttlInSeconds: number) {
          return this.sendMessage(TOPICS.OTP_EMAIL, `otp-${email}`, { email, otp, ttlInSeconds });
    }

    async sendWelcomeEmail(email: string) {
        return this.sendMessage(TOPICS.WELCOME_EMAIL, `welcome-${email}`, { email });
    }
}

export default new NotificationProducer();