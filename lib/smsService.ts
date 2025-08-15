import axios from "axios";

const BASE_URL =
  process.env.TEXTBEE_BASE_URL || "https://api.textbee.dev/api/v1";
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

interface SMSMessage {
  recipients: string[];
  message: string;
}

export class SMSService {
  private static instance: SMSService;

  private constructor() {}

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  async sendSMS(recipients: string[], message: string): Promise<boolean> {
    try {
      if (!API_KEY || !DEVICE_ID) {
        console.warn(
          "SMS service not configured - missing API key or device ID"
        );
        return false;
      }

      const response = await axios.post(
        `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
        {
          recipients,
          message,
        },
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SMS sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      return false;
    }
  }

  async sendCancellationNotification(
    studentPhone: string,
    lessonDate: string,
    instructorName: string
  ): Promise<boolean> {
    const message = `Your driving lesson on ${lessonDate} has been cancelled by ${instructorName}. Please contact the driving school to reschedule.`;

    return this.sendSMS([studentPhone], message);
  }

  async sendRescheduleNotification(
    studentPhone: string,
    oldDate: string,
    newDate: string,
    instructorName: string
  ): Promise<boolean> {
    const message = `Your driving lesson has been rescheduled from ${oldDate} to ${newDate} by ${instructorName}. Please confirm your availability.`;

    return this.sendSMS([studentPhone], message);
  }
}

export const smsService = SMSService.getInstance();
