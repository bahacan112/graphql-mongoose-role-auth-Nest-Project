// src/reservation/reservation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadedRecord } from '../schemas/uploaded-record.schema';
import { GroupSummary } from './dto/group-summary.output';
import { ReservationGroupByDateDto } from './dto/reservations-by-date.output';
import { ReservationByRegionDto } from './dto/reservations-by-group5-region.output';
@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(UploadedRecord.name)
    private readonly uploadedRecordModel: Model<UploadedRecord>,
  ) {}

  async getGroupSummaries(): Promise<GroupSummary[]> {
    const records = await this.uploadedRecordModel.find().lean();

    const grouped = new Map<string, GroupSummary>();

    for (const record of records) {
      const groupKey = [
        record.groupCodes?.grup1 || '-',
        record.groupCodes?.grup2 || '-',
        /*         record.groupCodes?.grup3 || '-',
         */ /* record.groupCodes?.grup4 || '-', */
        record.groupCodes?.grup5 || '-',
      ].join(' | ');

      const checkIn = record.itinerary?.[0]?.checkInDate || null;
      const checkOut = record.itinerary?.at(-1)?.checkOutDate || null;
      const passengerCount = record.passengers?.length || 0;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          groupKey,
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
  async findReservationsByDate(
    targetDate: string,
  ): Promise<ReservationGroupByDateDto[]> {
    const records = await this.uploadedRecordModel.find();
    const target = new Date(targetDate);
    const resultMap = new Map<string, ReservationGroupByDateDto>();

    for (const record of records) {
      const itinerary = record.itinerary || [];
      if (!itinerary.length) continue;

      const checkIn = itinerary[0]?.checkInDate;
      const checkOut = itinerary.at(-1)?.checkOutDate;
      if (!checkIn || !checkOut) continue;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (target >= checkInDate && target <= checkOutDate) {
        const groupKey = [
          record.groupCodes?.grup1 || '-',
          record.groupCodes?.grup2 || '-',
          record.groupCodes?.grup5 || '-',
        ].join(' | ');

        let transferState = 'N/A';
        let matched = false;

        if (itinerary.length === 1) {
          const segment = itinerary[0];
          if (
            new Date(segment.checkInDate).toDateString() ===
            target.toDateString()
          ) {
            transferState = `Airport --> ${segment.region}`;
            matched = true;
          } else if (
            new Date(segment.checkOutDate).toDateString() ===
            target.toDateString()
          ) {
            transferState = `${segment.region} --> Airport`;
            matched = true;
          }
        } else {
          for (let i = 0; i < itinerary.length; i++) {
            const segment = itinerary[i];
            const prev = itinerary[i - 1];
            const next = itinerary[i + 1];

            const isSameDay =
              segment.checkInDate &&
              segment.checkOutDate &&
              new Date(segment.checkInDate).toDateString() ===
                new Date(segment.checkOutDate).toDateString() &&
              new Date(segment.checkInDate).toDateString() ===
                target.toDateString();

            if (isSameDay) {
              const hotelLabel =
                segment.hotelType || segment.hotelName || 'Konaklama';
              const from = prev?.region || '?';
              const to = next?.region || '?';
              transferState = `${from} --> ${hotelLabel} --> ${to}`;
              matched = true;
              break;
            }

            if (
              segment.checkInDate &&
              new Date(segment.checkInDate).toDateString() ===
                target.toDateString()
            ) {
              transferState =
                i === 0
                  ? `Airport --> ${segment.region}`
                  : `${itinerary[i - 1].region} --> ${segment.region}`;
              matched = true;
              break;
            }

            if (
              segment.checkOutDate &&
              new Date(segment.checkOutDate).toDateString() ===
                target.toDateString() &&
              (!next ||
                new Date(next.checkInDate).toDateString() !==
                  target.toDateString())
            ) {
              transferState = `${segment.region} --> Airport`;
              matched = true;
              break;
            }
          }
        }

        if (!matched) {
          const stay = itinerary.find((seg) => {
            const inDate = new Date(seg.checkInDate);
            const outDate = new Date(seg.checkOutDate);
            return target >= inDate && target <= outDate;
          });

          if (stay?.region) {
            transferState = `Konaklama: ${stay.region}`;
          }
        }

        if (!resultMap.has(groupKey)) {
          resultMap.set(groupKey, {
            groupKey,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            voucherList: [record.voucher],
            totalPassengers: record.passengers?.length || 0,
            transferState,
            itinerary: record.itinerary, // 💥 Bunu ekledik
          });
        } else {
          const existing = resultMap.get(groupKey)!;
          existing.voucherList.push(record.voucher);
          existing.totalPassengers += record.passengers?.length || 0;
          // transferState overwrite edilmiyor
        }
      }
    }

    return Array.from(resultMap.values());
  }

  async findByGroup5AndRegionOnDate(
    targetDate: string,
  ): Promise<ReservationByRegionDto[]> {
    const target = new Date(targetDate);
    const records = await this.uploadedRecordModel.find().lean();

    const resultMap = new Map<string, ReservationByRegionDto>();
    for (const record of records) {
      const group5 = record.groupCodes?.grup5;
      const itinerary = record.itinerary;
      const region = itinerary?.[0]?.region;
      console.log(
        `Group 5 in kodu: ${group5}, İtinerary deki region: ${itinerary}, ve son olarak region: ${region} dur`,
      );
      if (!group5 || !region || !itinerary?.length) continue;
      console.log('kod devam ediyor');
      const checkIn = new Date(itinerary[0].checkInDate);
      const checkOut = new Date(itinerary[itinerary.length - 1].checkOutDate);
      console.log(
        'checking:',
        checkIn,
        checkOut,
        target,
        group5,
        region,
        'dir',
      );
      if (target >= checkIn && target <= checkOut) {
        const key = `${group5} | ${region}`;
        if (!resultMap.has(key)) {
          resultMap.set(key, {
            group5,
            region,
            voucherList: [record.voucher],
            passengerCount: record.passengers?.length || 0,
          });
        } else {
          const existing = resultMap.get(key)!;
          existing.voucherList.push(record.voucher);
          existing.passengerCount += record.passengers?.length || 0;
        }
      }
    }

    return Array.from(resultMap.values());
  }
}
