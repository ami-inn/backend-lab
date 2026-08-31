export interface OtpEmailNotification {
  email: string;
  otp: string;
  ttlInSeconds: number;
}

export interface WelcomeEmailNotification {
  email: string;
}

export interface AdminMessageByTopic {
    "station.created": {
        eventType: 'STATION_CREATED';
        data: {
            name: string;
            code: string;
            city: string;
            state: string;
        };
        timestamp: string;
    };
}

export type NotificationTopic = keyof AdminMessageByTopic;