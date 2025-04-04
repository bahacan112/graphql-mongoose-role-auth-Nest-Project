// dto/create-guide-sale.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateGuideSaleInput {
  @Field() combinedVoucher: string;
  @Field() guideId: string; // ✅ EKLENDİ

  @Field() saleDate: Date;
  @Field() packageName: string;
  @Field(() => Int) quantity: number;
  @Field(() => Int) price: number;
}
