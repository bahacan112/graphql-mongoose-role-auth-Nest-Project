// src/reservation/reservation.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadedRecord } from '../schemas/uploaded-record.schema';
import { GroupSummary } from './dto/group-summary.output';
import { ReservationGroupByDateDto } from './dto/reservations-by-date.output';
import { ReservationService } from './reservation.service';
import { ReservationByRegionDto } from './dto/reservations-by-group5-region.output';
import { GuideTourService } from '../guide/guide-tour/guide-tour.service';
import { ReservationSearchInput } from './dto/reservation-search.input';
@Resolver(() => UploadedRecord)
export class ReservationResolver {
  constructor(
    @InjectModel(UploadedRecord.name)
    private readonly uploadedRecordModel: Model<UploadedRecord>,
    private readonly reservationService: ReservationService,
    private readonly guideTourService: GuideTourService, // ekle
  ) {}
  @Query(() => [ReservationGroupByDateDto])
  async reservationsByDate(
    @Args('date', { type: () => String }) date: string,
  ): Promise<ReservationGroupByDateDto[]> {
    return this.reservationService.findReservationsByDate(date);
  }

  @Query(() => [GroupSummary])
  async groupSummaries(): Promise<GroupSummary[]> {
    const records = await this.uploadedRecordModel.find().lean(); // lean() ile performans artışı

    const grouped = new Map<string, GroupSummary>();

    for (const record of records) {
      const grup1 = record.groupCodes?.grup1 || '-';
      const grup2 = record.groupCodes?.grup2 || '-';
      const grup5 = record.groupCodes?.grup5 || '-';

      const groupKey = [grup1, grup2, grup5].join(' | ');

      const checkIn = record.itinerary?.[0]?.checkInDate || null;
      const checkOut = record.itinerary?.at(-1)?.checkOutDate || null;
      const passengerCount = record.passengers?.length || 0;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          groupKey,
          grup1,
          grup2,
          grup5,
          totalReservations: 1,
          totalPassengers: passengerCount,
          earliestCheckIn: checkIn,
          latestCheckOut: checkOut,
        });
      } else {
        const existing = grouped.get(groupKey)!;
        existing.totalReservations += 1;
        existing.totalPassengers += passengerCount;

        if (
          checkIn &&
          (!existing.earliestCheckIn || checkIn < existing.earliestCheckIn)
        ) {
          existing.earliestCheckIn = checkIn;
        }

        if (
          checkOut &&
          (!existing.latestCheckOut || checkOut > existing.latestCheckOut)
        ) {
          existing.latestCheckOut = checkOut;
        }
      }
    }

    return Array.from(grouped.values());
  }
  @Query(() => [ReservationByRegionDto])
  async reservationsByGroup5RegionOnDate(
    @Args('date', { type: () => String }) date: string,
  ): Promise<ReservationByRegionDto[]> {
    return this.reservationService.findByGroup5AndRegionOnDate(date);
  }

  // src/reservation/reservation.resolver.ts

  // mevcut constructor aynen kalıyor...

  @Query(() => [UploadedRecord], { name: 'searchReservations' })
  async searchReservations(
    @Args('filter', { type: () => ReservationSearchInput })
    filter: ReservationSearchInput,
  ) {
    return this.reservationService.searchReservations(filter);
  }
}
