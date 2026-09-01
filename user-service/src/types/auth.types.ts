export interface SendOtpRequestBody {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface SendOtpResponseData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: SendOtpResponseData;
}
