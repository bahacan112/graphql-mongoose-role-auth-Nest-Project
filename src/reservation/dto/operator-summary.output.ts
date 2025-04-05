// src/reservation/dto/operator-summary.output.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OperatorSummary {
  @Field()
  operatorCode: string;

  @Field(() => [String])
  vouchers: string[];

  @Field()
  passengerCount: number;
}
