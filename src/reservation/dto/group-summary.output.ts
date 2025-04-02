// src/reservation/dto/group-summary.output.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GroupSummary {
  @Field()
  groupKey: string;

  @Field()
  totalReservations: number;

  @Field()
  totalPassengers: number;

  @Field({ nullable: true })
  earliestCheckIn?: string;

  @Field({ nullable: true })
  latestCheckOut?: string;
}
