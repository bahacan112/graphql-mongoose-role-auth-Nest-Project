import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGuideTourInput {
  @Field() guideId: string;
  @Field() tourId: string;
}
