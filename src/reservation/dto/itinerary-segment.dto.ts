import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItinerarySegmentDto {
  @Field()
  segmentType: string;

  @Field({ nullable: true })
  hotelCode?: string;

  @Field({ nullable: true })
  hotelName?: string;

  @Field({ nullable: true })
  hotelType?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  transferRegion?: string;

  @Field({ nullable: true })
  room?: string;

  @Field({ nullable: true })
  room_type?: string;

  @Field({ nullable: true })
  mealPlan?: string;

  @Field({ nullable: true })
  checkInDate?: string;

  @Field({ nullable: true })
  checkOutDate?: string;
}
