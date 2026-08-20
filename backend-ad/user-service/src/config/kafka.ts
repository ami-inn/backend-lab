import { Kafka, logLevel } from "kafkajs";
import logger from "./logger";
import config from ".";

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: config.KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
  //   logCreator: (logLevel) => {
  //     return ({ namespace, level, label, log }) => {
  //       const { message, ...extra } = log
  //       switch (level) {
  //         case logLevel.ERROR:
  //           logger.error(`[${label}] ${message}`, extra)
  //           break
  //         case logLevel.WARN:
  //           logger.warn(`[${label}] ${message}`, extra)
  //           break
  //         case logLevel.INFO:
  //           logger.info(`[${label}] ${message}`, extra)
  //           break
  //         case logLevel.DEBUG:
  //           logger.debug(`[${label}] ${message}`, extra)
  //           break
  //         default:
  //           logger.info(`[${label}] ${message}`, extra)
  //           break
  //       }
  //     }
  //   },
  retry: {
    initialRetryTime: 300,
    retries: 10,
    maxRetryTime: 30000,
  },
});

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout:30000,
    idempotent:true,
    maxInFlightRequests:5,
    retry:{
        retries:5,
    }
});

let isConnected = false;

const connectProducer = async () => {
    if(!isConnected){
        await producer.connect();
        isConnected = true;
        logger.info("Kafka producer connected successfully");
    }
}


const disconnectProducer = async () => {
    if(isConnected){
        await producer.disconnect();
        isConnected = false;
        logger.info("Kafka producer disconnected successfully");
    }
}

// graceful shutdown
process.on("SIGTERM", async () => {
    await disconnectProducer();
    process.exit(0);
});

process.on("SIGINT", async () => {
    await disconnectProducer();
    process.exit(0);
});

export { kafka, producer, connectProducer, disconnectProducer };

