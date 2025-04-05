// src/reservation/dto/group-summary.output.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { OperatorSummary } from './operator-summary.output';

@ObjectType()
export class GroupSummary {
  @Field()
  groupKey: string;

  @Field()
  grup1: string;

  @Field()
  grup2: string;

  @Field()
  grup5: string;

  @Field()
  totalReservations: number;

  @Field()
  totalPassengers: number;

  @Field({ nullable: true })
  earliestCheckIn?: string;

  @Field({ nullable: true })
  latestCheckOut?: string;

  @Field(() => [OperatorSummary], { nullable: true })
  operatorSummary?: OperatorSummary[];
}
