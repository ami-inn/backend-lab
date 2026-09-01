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
    const { password: _password, ...userWithoutPassword } = userProfile || {};
    if(userProfile) {
        logger.info(`User profile for userId: ${userId} fetched from database and stored in redis cache`);
        await redis.set(`user:${userId}`, JSON.stringify(userWithoutPassword));
    }
    logger.info(`User profile for userId: ${userId} fetched from database`);
    return userWithoutPassword;

}

const updateProfile = async (userId: string, updateData: { firstName?: string; lastName?: string; email?: string }) => {
    logger.info(`Updating profile for userId: ${userId} in database`);
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
    });

    const { password: _password, ...userWithoutPassword } = updatedUser || {};

    logger.info(`Profile for userId: ${userId} updated successfully in database, updating redis cache`);
    await redis.set(`user:${userId}`, JSON.stringify(userWithoutPassword));
    logger.info(`Profile for userId: ${userId} updated successfully in redis cache`);

    return userWithoutPassword;
}

const deleteProfile = async (userId: string) => {
    logger.info(`Deleting profile for userId: ${userId} from database`);
    await prisma.user.delete({
        where: { id: userId },
    });

    logger.info(`Profile for userId: ${userId} deleted successfully from database, deleting from redis cache`);
    await redis.del(`user:${userId}`);
    logger.info(`Profile for userId: ${userId} deleted successfully from redis cache`);
}   



export const userService = {
    getProfile,
    updateProfile,
    deleteProfile,

}