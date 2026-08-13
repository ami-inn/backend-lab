import "dotenv/config";

const config = {
    SERVICE_NAME: process.env.SERVICE_NAME || 'user-service',
    PORT: process.env.PORT || 4001,
    OTP_TTL: process.env.OTP_TTL || 300,
    OTP_RATE_MAX_PER_HOUR: process.env.OTP_RATE_MAX_PER_HOUR || 5,
    OTP_MAX_VERIFY_ATTEMPTS: process.env.OTP_MAX_VERIFY_ATTEMPTS || 3,
    MAIL_SEND: process.env.MAIL_SEND || '',
    HMAC_SECRET: process.env.HMAC_SECRET || 'default_secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://admin:irctcpass@localhost:5432/postgres',
    REDIS_URL: process.env.REDIS_URL || 'redis://:irctcpass@localhost:6379',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
};

export default config;

