// src/reservation/dto/get-all-reservations.output.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReservationSummary {
  @Field()
  combinedVoucher: string;

  @Field({ nullable: true })
  status?: string;

  @Field()
  passengerCount: number;

  @Field({ nullable: true })
  checkInDate?: string;

  @Field({ nullable: true })
  checkOutDate?: string;
}
