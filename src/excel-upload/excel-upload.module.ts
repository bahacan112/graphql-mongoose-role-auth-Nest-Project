// src/excel-upload/excel-upload.module.ts
import { Module } from '@nestjs/common';
import { ExcelUploadService } from './excel-upload.service';
import { ExcelUploadResolver } from './excel-upload.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UploadedRecord,
  UploadedRecordSchema,
} from '../schemas/uploaded-record.schema';
import { ExcelUploadSelectedResolver } from './excel-upload-selected.resolver';
import { ExcelUpdateSelectedService } from './excel-update.selected.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadedRecord.name, schema: UploadedRecordSchema },
    ]),
  ],
  providers: [
    ExcelUploadService,
    ExcelUploadResolver,
    ExcelUploadSelectedResolver,
    ExcelUpdateSelectedService,
  ],
})
export class ExcelUploadModule {}
