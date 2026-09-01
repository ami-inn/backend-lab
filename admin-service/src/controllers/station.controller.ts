import { Request, Response } from "express";

import asyncHandler from "@/utils/asyncHandler";
import { BadRequestError } from "@/utils/error";
import { stationService } from "@/services/station.service";

type StationParams = {
  id: string;
};

export const createStation = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, code, city, state } = req.body;

    // Validate required fields
    if (!name || !code || !city || !state) {
      return new BadRequestError(
        "Missing required fields: name, code, city, state, location, status",
      );
    }

    const station = await stationService.createStation({
      name,
      code: code.toUpperCase(),
      city,
      state,
    });
    return res.status(201).json({
      success: true,
      message: "Station created successfully",
      data: station,
    });
  },
);

export const getAllStations = asyncHandler(
  async (_req: Request, res: Response) => {
    const stations = await stationService.getAllStations();
    return res.status(200).json({
      success: true,
      message: "Stations retrieved successfully",
      data: stations,
    });
  },
);

export const updateStation = asyncHandler(
  async (req: Request<StationParams>, res: Response) => {
    const { id } = req.params;

    const { name, code, city, state } = req.body;

    const station = await stationService.updateStation(id, {
      name,
      code: code?.toUpperCase(),
      city,
      state,
    });
    return res.status(200).json({
      success: true,
      message: "Station updated successfully",
      data: station,
    });
  },
);

export const deleteStation = asyncHandler(
  async (req: Request<StationParams>, res: Response) => {
    const { id } = req.params;

    await stationService.deleteStation(id);
    return res.status(200).json({
      success: true,
      message: "Station deleted successfully",
    });
  },
);

export const getStationById = asyncHandler(
  async (req: Request<StationParams>, res: Response) => {
    const { id } = req.params;

    const station = await stationService.getStationById(id);
    return res.status(200).json({
      success: true,
      message: "Station retrieved successfully",
      data: station,
    });
  },
);
