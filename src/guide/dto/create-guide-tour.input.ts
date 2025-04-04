import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGuideTourInput {
  @Field() guideId: string;

  @Field() grup1: string;
  @Field() grup2: string;
  @Field() grup5: string;
}
