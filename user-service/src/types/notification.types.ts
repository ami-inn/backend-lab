export interface OtpEmailNotification {
  email: string;
  otp: string;
  ttlInSeconds: number;
}

export interface WelcomeEmailNotification {
  email: string;
}

export interface NotificationMessageByTopic {
  "notification.email.otp": OtpEmailNotification;
  "notification.email.welcome": WelcomeEmailNotification;
}

export type NotificationTopic = keyof NotificationMessageByTopic;