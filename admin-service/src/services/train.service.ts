import logger from "@/config/logger";
import { prisma } from "@/config/prisma";
import { ConflictError } from "@/utils/error";
import adminProducer from "@/kafka/producer/admin.producer";

type SeatInput = {
  seatNumber: string;
  seatType:  "LOWER" | "UPPER" | "SIDE_LOWER" | "SIDE_UPPER";
  seatPrice: number;
};

type CreateTrainInput = {
  trainName: string;
  trainNumber: string;
  coachName: string;
  seats: SeatInput[];
};

type updateTrainInput = {
  trainName?: string;
  trainNumber?: string;
  coachName?: string;
  seats?: SeatInput[];
};

const createTrain = async (data: CreateTrainInput) => {
  const {
    trainName,
    trainNumber,
    coachName,
    seats,
  } = data;

  // Check if train already exists
  const existing = await prisma.train.findUnique({
    where: {
      trainNumber,
    },
  });

  if (existing) {
    throw new ConflictError(
      `Train with number ${trainNumber} already exists`,
    );
  }

  // Check for duplicate seat numbers
  const seatNumbers = seats.map(
    (s) => s.seatNumber,
  );

  if (
    new Set(seatNumbers).size !==
    seatNumbers.length
  ) {
    throw new ConflictError(
      "Duplicate seat numbers found in the request",
    );
  }

  // Create train with seats
  const train = await prisma.train.create({
    data: {
      trainName,
      trainNumber,
      coachName,
      totalSeats: seats.length,

      seats: {
        create: seats.map((s) => ({
          seatNumber: s.seatNumber,
          seatType: s.seatType,
          price: s.seatPrice,
        })),
      },
    },

    include: {
      seats: {
        orderBy: {
          seatNumber: "asc",
        },
      },
    },
  });

  logger.info(
    `Train created successfully with number: ${trainNumber}`,
  );

  // Publish Kafka event
  await adminProducer
    .publishTrainCreatedEvent({
      trainName,
      trainNumber,
      coachName,
      seats,
    })
    .catch((err) => {
      logger.error(
        `Failed to publish train created event for number: ${trainNumber}`,
        err,
      );
    });

  return train;
};

const getAllTrains = async () => {
  const trains = await prisma.train.findMany({
    include: {
      seats: {
        orderBy: {
          seatNumber: "asc",
        },
      },
    },
  });
  return trains;
};

const getTrainById = async (id: string) => {
  const train = await prisma.train.findUnique({
    where: { id },
    include: {
      seats: {
        orderBy: {
          seatNumber: "asc",
        },
      },
    },
  });

  if (!train) {
    throw new ConflictError(
      `Train with id ${id} does not exist`,
    );
  }

  return train;
};

export const updateTrain = async (
  id: string,
  data: updateTrainInput,
) => {
  const { seats, ...trainData } = data;

  const train = await prisma.train.update({
    where: {
      id,
    },

    data: {
      ...trainData,

      ...(seats
        ? {
            totalSeats: seats.length,

            seats: {
              deleteMany: {},

              create: seats.map((seat) => ({
                seatNumber: seat.seatNumber,
                seatType: seat.seatType,
                price: seat.seatPrice,
              })),
            },
          }
        : {}),
    },

    include: {
      seats: {
        orderBy: {
          seatNumber: "asc",
        },
      },
    },
  });

  return train;
};

export const deleteTrain = async (id: string) => {
  const train = await prisma.train.delete({
    where: { id },
  });

  logger.info(
    `Train deleted successfully with id: ${id}`,
  );

  return train;
};

export const trainService = {
  createTrain,
  getAllTrains,
  getTrainById,
  updateTrain,
  deleteTrain,
};

export default trainService;