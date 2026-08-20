import { Kafka,logLevel } from "kafkajs";

import logger from "./logger";

import config from ".";

export const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: config.KAFKA_BROKERS,
  logLevel: logLevel.ERROR,

  retry: {
    initialRetryTime: 300,
    retries: 10,
    maxRetryTime: 30000,
    multiplier: 1.5,
  },
});

const consumer = kafka.consumer({ groupId: `notification-service-group`,sessionTimeout:30000,heartbeatInterval:3000 });

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout:30000,
});

//gracefully shutdown
const shutdown = async () => {
    logger.info('shutting down kafka connection...');
    await consumer.disconnect();
    await producer.disconnect();
    logger.info('kafka connection closed');
    process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export { consumer, producer };