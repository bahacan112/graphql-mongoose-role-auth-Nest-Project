// src/contact/contact.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async handleContactForm(@Body() body: { email: string; message: string }) {
    const { email, message } = body;

    await this.contactService.sendContactForm(email, message);

    return { success: true, message: 'Mail gönderildi' };
  }
}
