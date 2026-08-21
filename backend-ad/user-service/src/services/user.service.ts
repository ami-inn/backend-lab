import logger from "@/config/logger"
import { prisma } from "@/config/prisma";
import { redis } from "@/config/redis";




const getProfile = async (userId: string) => {
    logger.info(`Fetching profile for userId: ${userId} from redis cache `);

    const storedUser = await redis.get(`user:${userId}`);

    if(storedUser) {
        logger.info(`User profile for userId: ${userId} found in redis cache`);
        return JSON.parse(storedUser);
    }

    logger.info(`User profile for userId: ${userId} not found in redis cache`);
    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        
    });
    const userWithoutPassword = { ...(userProfile || {}) };
    delete userWithoutPassword.password;
    if(userProfile) {
        logger.info(`User profile for userId: ${userId} fetched from database and stored in redis cache`);
        await redis.set(`user:${userId}`, JSON.stringify(userWithoutPassword));
    }
    logger.info(`User profile for userId: ${userId} fetched from database`);
    return userWithoutPassword;

}



export const userService = {
    getProfile,

}