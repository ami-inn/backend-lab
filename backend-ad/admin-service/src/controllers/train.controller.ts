

import logger from "@/config/logger";
import { ConflictError,BadRequestError } from "@/utils/error";
import createTrain from "@/services/train.service";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";



export const createTrainController = asyncHandler(async (req: Request, res: Response) => {
    const { trainName, trainNumber, coachName, seats } = req.body;

    console.log("Received request to create train:", { trainName, trainNumber, coachName, seats });

    // Validate input
    if (!trainName || !trainNumber || !coachName || !seats) {
      throw new BadRequestError("Missing required fields: trainName, trainNumber, coachName, seats");
    }

    // Call the service to create the train
    const newTrain = await createTrain({ trainName, trainNumber, coachName, seats });

    return res.status(201).json(newTrain);
});