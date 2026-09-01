
import { Request, Response } from "express";


import asyncHandler from "@/utils/asyncHandler";
import { BadRequestError } from "@/utils/error";
import { stationService } from "@/services/station.service";


export const createStation = asyncHandler(async (req: Request, res: Response) => {
    const {name,code,city,state} = req.body;

    // Validate required fields
    if (!name || !code || !city || !state ) {
        return new BadRequestError("Missing required fields: name, code, city, state, location, status");
    }
    
    const station = await stationService.createStation({name, code: code.toUpperCase(), city, state});
    return res.status(201).json({
        success: true,
        message: "Station created successfully",
        data: station,
    });
});