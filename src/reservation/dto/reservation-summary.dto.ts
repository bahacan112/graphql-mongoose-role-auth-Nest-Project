// src/reservation/dto/get-grouped-reservation-summary.output.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupedReservationSummaryDto {
  @Field()
  groupKey: string;

  @Field()
  reservationCount: number;

  @Field()
  totalPassengers: number;

  @Field({ nullable: true })
  checkInDate?: string;

  @Field({ nullable: true })
  checkOutDate?: string;
}
