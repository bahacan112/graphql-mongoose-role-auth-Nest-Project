import { ObjectType, Field } from '@nestjs/graphql';
import { UploadedRecord } from 'src/schemas/uploaded-record.schema';
import { Guide } from 'src/schemas/guide.schema';
import { Package } from 'src/schemas/package.schema';
import { GuideTourAssignment } from 'src/schemas/guide-tour.schema';
import { GuideSale } from 'src/schemas/guide-sale.schema'; // ✅ yeni import

@ObjectType()
export class AllDataOutput {
  @Field(() => [UploadedRecord])
  reservations: UploadedRecord[];

  @Field(() => [Guide])
  guides: Guide[];

  @Field(() => [Package])
  packages: Package[];

  @Field(() => [GuideSale]) // ✅ sadece bunu ekliyorsun
  guideSales: GuideSale[];

  @Field(() => [GuideTourAssignment])
  assignments: GuideTourAssignment[];
}
@ObjectType()
export class GuideSaleWithGuideName {
  @Field() _id: string;
  @Field() guideId: string;
  @Field() combinedVoucher: string;
  @Field() packageName: string;
  @Field() quantity: number;
  @Field() price: number;
  @Field() saleDate: string;
  @Field() guideName: string; // 👈 ekstra alan
}
