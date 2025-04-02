import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePackageInput {
  @Field() name: string;
  @Field() region: string;
  @Field({ nullable: true }) note?: string;
}
