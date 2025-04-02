import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGuideSaleInput {
  @Field() guideId: string;
  @Field() tourId: string;
  @Field() packageId: string;
  @Field() quantity: number;
  @Field({ nullable: true }) saleDate?: Date;
}
