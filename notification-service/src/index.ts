import config from "@/config";
import logger from "@/config/logger";
import emailConsumer from "@/kafka/consumer/email.consumer";



async function startNotificationService() {
  try {
    logger.info('Starting Notification Service...');
    const missing = [
      !config.SENDGRID_API_KEY && "SENDGRID_API_KEY",
      !config.MAIL_SEND && "MAIL_SEND",
    ].filter(Boolean);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    await emailConsumer.start();
    logger.info('Notification Service started successfully');
  } catch (error) {
    logger.error(`Failed to start Notification Service: ${error}`);
    process.exit(1);
  }
}

//handle uncaught error
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});

//handle unhandled promise rejection
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);

});

startNotificationService();