// src/common/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/schemas/log.shema';
import { LogService } from './logger.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]), // 🔥 BURASI ÖNEMLİ
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LoggerModule {}
