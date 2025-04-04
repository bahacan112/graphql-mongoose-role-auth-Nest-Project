// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedDataResolver } from './shared-data.resolver';
import {
  UploadedRecord,
  UploadedRecordSchema,
} from 'src/schemas/uploaded-record.schema';
import { Guide, GuideSchema } from 'src/schemas/guide.schema';
import { Package, PackageSchema } from 'src/schemas/package.schema';
import {
  GuideTourAssignment,
  GuideTourAssignmentSchema,
} from 'src/schemas/guide-tour.schema';
import { SharedDataService } from './shared-data.service';
import { GuideSaleSchema, GuideSale } from 'src/schemas/guide-sale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadedRecord.name, schema: UploadedRecordSchema },
      { name: Guide.name, schema: GuideSchema },
      { name: Package.name, schema: PackageSchema },
      { name: GuideTourAssignment.name, schema: GuideTourAssignmentSchema },
      { name: GuideSale.name, schema: GuideSaleSchema },
    ]),
  ],
  providers: [SharedDataResolver, SharedDataService],
})
export class SharedModule {}
