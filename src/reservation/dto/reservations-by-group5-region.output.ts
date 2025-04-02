import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReservationByRegionDto {
  @Field()
  group5: string;

  @Field()
  region: string;

  @Field(() => [String])
  voucherList: string[];

  @Field()
  passengerCount: number;
}
