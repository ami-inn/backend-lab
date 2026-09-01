export interface OtpEmailNotification {
  email: string;
  otp: string;
  ttlInSeconds: number;
}

export interface WelcomeEmailNotification {
  email: string;
}
export interface AdminMessageByTopic {
  "admin.station.created": {
    eventType: "STATION_CREATED";
    data: {
      name: string;
      code: string;
      city: string;
      state: string;
    };
    timestamp: string;
  };

  "admin.train.created": {
    eventType: "TRAIN_CREATED";
    data: {
      trainName: string;
      trainNumber: string;
      coachName: string;
      seats: {
        seatNumber: string;
        seatType: string;
        seatPrice: number;
      }[];
    };
    timestamp: string;
  };
}

export type AdminTopic = keyof AdminMessageByTopic;