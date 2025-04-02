import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Guide, GuideSchema } from 'src/schemas/guide.schema';
import { GuideService } from './guide.service';
import { GuideResolver } from './guide.resolver';
import { Package, PackageSchema } from 'src/schemas/package.schema';
import { GuideSale, GuideSaleSchema } from 'src/schemas/guide-sale.schema';
import { GuideSaleService } from './guide-sale/guide-sale.service';
import { GuideSaleResolver } from './guide-sale/guide-sale.resolver';
import { PackageService } from './package/package.service';
import { PackageResolver } from './package/package.resolver';
import {
  GuideTourAssignment,
  GuideTourAssignmentSchema,
} from 'src/schemas/guide-tour.schema';
import { GuideTourService } from './guide-tour/guide-tour.service';
import { GuideTourResolver } from './guide-tour/guide-tour.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guide.name, schema: GuideSchema },
      { name: Package.name, schema: PackageSchema },
      { name: GuideSale.name, schema: GuideSaleSchema },
      { name: GuideTourAssignment.name, schema: GuideTourAssignmentSchema },
    ]),
  ],
  providers: [
    GuideService,
    GuideResolver,
    PackageService,
    PackageResolver,
    GuideSaleService,
    GuideSaleResolver,
    GuideTourService,
    GuideTourResolver,
  ],
  exports: [GuideService],
})
export class GuideModule {}
