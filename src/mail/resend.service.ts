// src/resend/resend.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail({
    to,
    subject,
    html,
    from = process.env.RESEND_SEND_MAIL,
  }: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      return response;
    } catch (error) {
      console.error('Resend Error:', error);
      throw error;
    }
  }
}
