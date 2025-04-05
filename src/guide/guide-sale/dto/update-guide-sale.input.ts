// dto/update-guide-sale.input.ts
import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class UpdateGuideSaleInput {
  @Field(() => ID)
  id?: string;

  @Field({ nullable: true }) saleDate?: Date;
  @Field({ nullable: true }) packageName?: string;
  @Field(() => Int, { nullable: true }) quantity?: number;
  @Field(() => Int, { nullable: true }) price?: number;
}
