// src/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ResendService } from '../mail/resend.service'; // varsa zaten başka modülde olabilir

@Module({
  controllers: [ContactController],
  providers: [ContactService, ResendService],
})
export class ContactModule {}
