// src/shared/dto/reservation-filter.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReservationFilterInput {
  @Field({ nullable: true }) grup1?: string;
  @Field({ nullable: true }) grup2?: string;
  @Field({ nullable: true }) grup5?: string;
  @Field({ nullable: true }) combinedVoucher?: string;
  @Field({ nullable: true }) status?: string;
  @Field({ nullable: true }) operatorCode?: string;
  @Field({ nullable: true }) bolgeKodu?: string; // rehber bölgesi
  @Field({ nullable: true }) checkInDate?: string;
  @Field({ nullable: true }) checkInDateTo?: string;
  @Field({ nullable: true }) checkOutDate?: string;
  @Field({ nullable: true }) checkOutDateTo?: string;
  @Field({ nullable: true }) fullName?: string;
  @Field({ nullable: true }) operatorName?: string;
  @Field({ nullable: true }) hotelName?: string;
  @Field({ nullable: true }) hotelCode?: string;
  @Field({ nullable: true }) product?: string;
  @Field({ nullable: true }) arrivalPNR?: string;
  @Field({ nullable: true }) arrivalFlightDate?: string;
  @Field({ nullable: true }) departureFlightDate?: string;
  @Field({ nullable: true }) departurePNR?: string;
  @Field({ nullable: true }) adSoyad?: string;
  @Field({ nullable: true }) packageName?: string;
  @Field({ nullable: true }) saleDate?: string;
  @Field({ nullable: true }) saleDateTo?: string;
}
