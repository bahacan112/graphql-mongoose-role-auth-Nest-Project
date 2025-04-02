// src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { ResendService } from '../mail/resend.service';

@Injectable()
export class ContactService {
  constructor(private readonly resendService: ResendService) {}

  async sendContactForm(userEmail: string, message: string) {
    await this.resendService.sendEmail({
      to: 'bzenbil19@gmail.com',
      subject: 'Yeni İletişim Formu Mesajı',
      html: `<p>Gönderen: ${userEmail}</p><p>Mesaj: ${message}</p>`,
    });
  }
}
