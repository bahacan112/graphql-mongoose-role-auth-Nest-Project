import { Field, ObjectType } from '@nestjs/graphql';
import { ItinerarySegmentDto } from './itinerary-segment.dto';

@ObjectType()
export class ReservationGroupByDateDto {
  @Field()
  groupKey: string;
  @Field()
  grup1: string;
  @Field()
  grup2: string;
  @Field()
  grup5: string;

  @Field({ nullable: true })
  checkInDate?: string;

  @Field({ nullable: true })
  checkOutDate?: string;

  @Field()
  totalPassengers: number;

  @Field(() => [String])
  voucherList: string[];

  @Field()
  transferState: string;

  @Field(() => [ItinerarySegmentDto], { nullable: true })
  itinerary?: ItinerarySegmentDto[];

  @Field({ nullable: true })
  assignedGuideName?: string;
  @Field({ nullable: true })
  assignedGuideTelefon?: string;
}
