// reservation.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import {
  UploadedRecord,
  UploadedRecordSchema,
} from '../schemas/uploaded-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UploadedRecord.name,
        schema: UploadedRecordSchema,
      },
    ]),
  ],
  providers: [ReservationResolver, ReservationService],
})
export class ReservationModule {}
