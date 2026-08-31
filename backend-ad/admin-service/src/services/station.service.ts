import logger from "@/config/logger";
import {prisma} from '../config/prisma'
import { ConflictError } from "@/utils/error";
import adminProducer from "@/kafka/producer/admin.producer";


const createStation = async(data:{ name: string; code: string; city: string;state:string})=>{
    const { name, code, city, state, } = data;
    const existing = await prisma.station.findUnique({
        where: { code },
    });
    if (existing) {
        throw new ConflictError(`Station with code ${code} already exists`);
    }
    const station = await prisma.station.create({
        data
    });
    logger.info(`Station created successfully with code: ${code}`);
    //we send ev on kafka
    await adminProducer.publishStationCreatedEvent({ name, code, city, state }).catch((err) => {
        logger.error(`Failed to publish station created event for code: ${code}`, err);
    });
    return station;

}


export const stationService = {
    createStation
}