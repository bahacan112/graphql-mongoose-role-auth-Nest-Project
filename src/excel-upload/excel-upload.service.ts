// excel-upload.service.ts
import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UploadedRecord,
  UploadedRecordDocument,
} from '../schemas/uploaded-record.schema';

@Injectable()
export class ExcelUploadService {
  constructor(
    @InjectModel(UploadedRecord.name)
    private uploadedModel: Model<UploadedRecordDocument>,
  ) {}

  async processExcel(buffer: Buffer): Promise<boolean> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const groupedData: Record<string, any> = {};

    const excelSerialToDate = (serial: any) => {
      const utcDays = Math.floor(serial - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      return dateInfo.toISOString().split('T')[0];
    };

    for (const row of sheetData) {
      const operator = row['Operatör'] || 'UNKNOWN';
      const voucher = row['Voucher'] || 'NO_VOUCHER';
      const combinedVoucher = `${operator}-${voucher}`;

      if (!groupedData[combinedVoucher]) {
        groupedData[combinedVoucher] = {
          combinedVoucher,
          voucher,
          operatorCode: operator,
          operatorName: row['Operatör Adı'] || null,
          product: row['Grup1 Açıklama'] || null,
          status: '',
          notes: {
            hotelNote: row['Otel Notu'] || '',
            voucherNote: row['Voucher Notu'] || '',
            internalNote: row['İntern Notu'] || '',
            transferNote: row['Trf. Notu'] || '',
            cancelNote: row['İptal Notu'] || '',
          },
          passengers: [],
          itinerary: [],
          groupCodes: {
            grup1: row['Grup1 '],
            grup2: row['Grup2 '],
            grup3: row['Grup3 '],
            grup4: row['Grup4 '],
            grup5: row['Grup5 '],
          },
        };
      }

      const passengerObj = {
        title: row['Ünvanı'] || '',
        passengerIndex: row['Müşt.Sıra'] || null,
        fullName: row['Misafir Adı'] || '',
        birthday: row['Doğum Tarihi'] || '',
        passportNo: row['Pasaport No'] || '',
        arrivalFlight: {
          arrivalFrom: row['Geliş From'] || '',
          arrivalTo: row['Geliş To'] || '',
          arrivalFlightNo: row['Geliş Ucuş No'] || '',
          arrivalPNR: row['Geliş PNR'] || '',
          arrivalFlightDate: row['Geliş Tarihi'] || '',
          arrivalFlightTime: row['Geliş Saati'] || '',
        },

        departureFlight: {
          departureFrom: row['Dönüş From'] || '',
          departureTo: row['Dönüş To'] || '',
          departureFlightNo: row['Dönüş Uçuş No'] || '',
          departurePNR: row['Dönüş PNR'] || '',
          departureFlightDate: row['Dönüş Tarihi'] || '',
          departureFlightTime: row['Dönüş Saati'] || '',
        },
      };

      const itineraryObj = {
        segmentType: 'hotel',
        hotelCode: row['Otel '] || '',
        hotelName: row['Otel Adı'] || '',
        hotelType: row['Otel Türü'] || '',
        region: row['Bölge'] || '',
        transferRegion: row['Trf.Bölge'] || '',
        room: row['Oda '] || '',
        room_type: row['Oda Tipi'] || '',
        mealPlan: row['Pans '] || '',
        checkInDate: row['Giriş Tarihi']
          ? excelSerialToDate(row['Giriş Tarihi'])
          : '',
        checkOutDate: row['Çıkış Tarihi']
          ? excelSerialToDate(row['Çıkış Tarihi'])
          : '',
      };

      groupedData[combinedVoucher].passengers.push(passengerObj);
      groupedData[combinedVoucher].itinerary.push(itineraryObj);
    }

    for (const key of Object.keys(groupedData)) {
      const booking = groupedData[key];

      const seenPassengers = new Set();
      const uniquePassengers = [];
      for (const p of booking.passengers) {
        const passKey = `${p.title}-${p.passengerIndex}-${p.fullName}`;
        if (!seenPassengers.has(passKey)) {
          seenPassengers.add(passKey);
          uniquePassengers.push(p);
        }
      }
      booking.passengers = uniquePassengers;

      const seenItinerary = new Set();
      const uniqueItinerary = [];
      for (const i of booking.itinerary) {
        const iKey = [
          i.segmentType,
          i.hotelCode,
          i.hotelName,
          i.room,
          i.room_type,
          i.mealPlan,
          i.checkInDate,
          i.checkOutDate,
          i.region,
          i.transferRegion,
        ].join('|');
        if (!seenItinerary.has(iKey)) {
          seenItinerary.add(iKey);
          uniqueItinerary.push(i);
        }
      }
      booking.itinerary = uniqueItinerary;
    }

    const bookings = Object.values(groupedData) as UploadedRecord[];

    const bulkOps = bookings.map((booking) => ({
      updateOne: {
        filter: { combinedVoucher: booking.combinedVoucher },
        update: {
          $set: {
            passengers: booking.passengers,
            itinerary: booking.itinerary,
            product: booking.product,
            groupCodes: booking.groupCodes,
            operatorCode: booking.operatorCode,
            operatorName: booking.operatorName,
            voucher: booking.voucher,
            status: booking.status,
            notes: booking.notes,
          },
        },
        upsert: true,
      },
    }));

    const result = await this.uploadedModel.bulkWrite(bulkOps);

    /*     console.log('📦 Excel kayıt işlemi tamamlandı:');
    console.log(`✅ Güncellenen: ${result.modifiedCount}`);
 */ console.log(`➕ Eklenen: ${result.upsertedCount}`);

    return true;
  }
}
