import "dotenv/config";

const config = {
    PORT: process.env.PORT || 4006,
    SERVICE_NAME: 'Admin Service',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://admin:irctcpass@localhost:5432/admin-service_database',
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
KAFKA_BROKERS: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'admin-service',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000', 'http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003'],
};

export default config;