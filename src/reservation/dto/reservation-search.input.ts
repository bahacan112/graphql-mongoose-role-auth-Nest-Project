import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReservationSearchInput {
  @Field({ nullable: true }) combinedVoucher?: string;
  @Field({ nullable: true }) operatorCode?: string;
  @Field({ nullable: true }) voucher?: string;
  @Field({ nullable: true }) hotelName?: string;
  @Field({ nullable: true }) region?: string;
  @Field({ nullable: true }) group1?: string;
  @Field({ nullable: true }) group2?: string;
  @Field({ nullable: true }) group5?: string;

  @Field({ nullable: true }) passengerName?: string;

  @Field({ nullable: true }) checkInDateFrom?: string;
  @Field({ nullable: true }) checkInDateTo?: string;
  @Field({ nullable: true }) checkOutDateFrom?: string;
  @Field({ nullable: true }) checkOutDateTo?: string;

  @Field({ nullable: true }) guideId?: string; // rehber filtresi
}
