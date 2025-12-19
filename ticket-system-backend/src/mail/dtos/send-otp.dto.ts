export class SendOtpEmailDto {
  to: string | string[];
  data: {
    otp: string;
    purpose?: string;
    validity?: number;
    name?: string;
  };
}
