import { connectProducer, producer } from "@/config/kafka";


import logger from "@/config/logger";
import { AdminMessageByTopic,NotificationTopic } from "@/utils/types/admin.types";
import { TOPICS } from "@/utils/constants";

// this will prevent multiple connections to kafka producer

class AdminProducer {
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
        message: AdminMessageByTopic[T],
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

    async publishStationCreatedEvent(station: { name: string; code: string; city: string; state: string }) {
        return this.sendMessage(TOPICS.STATION_CREATED, `station-${station.code}`, {eventType:'STATION_CREATED', data: station, timestamp: new Date().toISOString() });
    }
}

export default new AdminProducer();