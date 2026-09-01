

import logger from "@/config/logger";
import { ConflictError,BadRequestError } from "@/utils/error";
import trainService from "@/services/train.service";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";


type trainParams = {
    id: string;
  };


export const createTrainController = asyncHandler(async (req: Request, res: Response) => {
    const { trainName, trainNumber, coachName, seats } = req.body;

    console.log("Received request to create train:", { trainName, trainNumber, coachName, seats });

    // Validate input
    if (!trainName || !trainNumber || !coachName || !seats) {
      throw new BadRequestError("Missing required fields: trainName, trainNumber, coachName, seats");
    }

    // Call the service to create the train
    const newTrain = await trainService.createTrain({ trainName, trainNumber, coachName, seats });

    return res.status(201).json(newTrain);
});

export const getAllTrainsController = asyncHandler(async (req: Request, res: Response) => {
    const trains = await trainService.getAllTrains();
    return res.status(200).json(trains);
});

export const updateTrainController = asyncHandler(async (req: Request<trainParams> , res: Response) => {
    const { id } = req.params;
    const { trainName, trainNumber, coachName, seats } = req.body;

    // Validate input
    if (!trainName && !trainNumber && !coachName && !seats) {
      throw new BadRequestError("At least one field must be provided for update");
    }

    const updatedTrain = await trainService.updateTrain(id, { trainName, trainNumber, coachName, seats });
    return res.status(200).json(updatedTrain);
});

export const deleteTrainController = asyncHandler(async (req: Request<trainParams>, res: Response) => {
    const { id } = req.params;
    await trainService.deleteTrain(id);
    return res.status(204).send();
});

export const    getTrainByIdController = asyncHandler(async (req: Request<trainParams>, res: Response) => {
    const { id } = req.params;
    const train = await trainService.getTrainById(id);
    return res.status(200).json(train);
});
