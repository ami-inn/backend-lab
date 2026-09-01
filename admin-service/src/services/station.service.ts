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

const getAllStations = async()=>{
    const stations = await prisma.station.findMany();
    return stations;
}

const updateStation = async(id:string, data:{ name?: string; code?: string; city?: string;state?:string})=>{
    const station = await prisma.station.update({
        where: { id },
        data
    });
    logger.info(`Station updated successfully with id: ${id}`);
    return station;
}

const deleteStation = async(id:string)=>{
    const station = await prisma.station.delete({
        where: { id },
    });
    logger.info(`Station deleted successfully with id: ${id}`);
    return station;
}

const getStationById = async(id:string)=>{
    const station = await prisma.station.findUnique({
        where: { id },
    });
    if(!station){
        throw new ConflictError(`Station with id ${id} does not exist`);
    }
    return station;
}



export const stationService = {
    createStation,
    getAllStations,
    updateStation,
    deleteStation,
    getStationById
}