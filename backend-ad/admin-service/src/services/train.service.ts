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

export default createTrain;