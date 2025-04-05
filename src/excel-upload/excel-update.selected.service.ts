// excel-update-selected.service.ts
import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UploadedRecord,
  UploadedRecordDocument,
} from '../schemas/uploaded-record.schema';

@Injectable()
export class ExcelUpdateSelectedService {
  constructor(
    @InjectModel(UploadedRecord.name)
    private uploadedModel: Model<UploadedRecordDocument>,
  ) {}

  async updateSelectedFields(
    buffer: Buffer,
    selectedFields: string[],
  ): Promise<boolean> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheetData) {
      const operator = row['Operatör'];
      const voucher = row['Voucher'];
      const fullName = row['Misafir Adı'];

      if (!operator || !voucher || !fullName) continue;

      const combinedVoucher = `${operator}-${voucher}`;
      const updateObj: any = {};

      for (const field of selectedFields) {
        const excelKey = this.mapFieldToExcelKey(field);
        if (!excelKey) continue;

        const value = row[excelKey];
        if (value !== undefined) {
          updateObj[field] = value;
        }
      }

      for (const fieldPath of Object.keys(updateObj)) {
        const value = updateObj[fieldPath];

        if (fieldPath.startsWith('passengers.')) {
          const passengerField = fieldPath.split('.').slice(1).join('.'); // 🛠 doğru yol
          /*       const updateResult = await this.uploadedModel.updateOne(
            {
              combinedVoucher,
              'passengers.fullName': fullName,
            },
            {
              $set: {
                [`passengers.$[elem].${passengerField}`]: value,
              },
            },
            {
              arrayFilters: [{ 'elem.fullName': fullName }],
            },
          ); */
          /*           console.log(
            `🧳 Passenger güncelleme | passengers.$[elem].${passengerField} =`,
            value,
          );
          console.log('📦 Passenger update result:', updateResult);
 */
        } else if (fieldPath.startsWith('itinerary.')) {
          const updateKey = `itinerary.0.${fieldPath.split('.').slice(1).join('.')}`;
          const updateResult = await this.uploadedModel.updateOne(
            {
              combinedVoucher,
              'itinerary.0': { $exists: true },
            },
            {
              $set: {
                [updateKey]: value,
              },
            },
          );
          console.log(`🏨 Itinerary güncelleme | ${updateKey} =`, value);
          console.log('📦 Itinerary update result:', updateResult);
        } else {
          const updateResult = await this.uploadedModel.updateOne(
            { combinedVoucher },
            { $set: { [fieldPath]: value } },
          );
          console.log(`🔧 Root alan güncelleme | ${fieldPath} =`, value);
          console.log('📦 Root update result:', updateResult);
        }
      }
    }

    return true;
  }

  private mapFieldToExcelKey(field: string): string | null {
    console.log('Field Alanı', field);
    const map: Record<string, string> = {
      'passengers.title': 'Ünvanı',
      'passengers.passengerIndex': 'Müşt.Sıra',
      'passengers.fullName': 'Misafir Adı',
      'passengers.birthday': 'Doğum Tarihi',
      'passengers.passportNo': 'Pasaport No',
      'passengers.arrivalFlight.arrivalFrom': 'Geliş From',
      'passengers.arrivalFlight.arrivalTo': 'Geliş To',
      'passengers.arrivalFlight.arrivalFlightNo': 'Geliş Ucuş No',
      'passengers.arrivalFlight.arrivalPNR': 'Geliş PNR',
      'passengers.arrivalFlight.arrivalFlightDate': 'Geliş Tarihi',
      'passengers.arrivalFlight.arrivalFlightTime': 'Geliş Saati',
      'passengers.departureFlight.departureFrom': 'Dönüş From',
      'passengers.departureFlight.departureTo': 'Dönüş To',
      'passengers.departureFlight.departureFlightNo': 'Dönüş Uçuş No',
      'passengers.departureFlight.departurePNR': 'Dönüş PNR',
      'passengers.departureFlight.departureFlightDate': 'Dönüş Tarihi',
      'passengers.departureFlight.departureFlightTime': 'Dönüş Saati',
      'itinerary.segmentType': 'Segment Türü',
      'itinerary.hotelCode': 'Otel ',
      'itinerary.hotelName': 'Otel Adı',
      'itinerary.hotelType': 'Otel Türü',
      'itinerary.region': 'Bölge',
      'itinerary.transferRegion': 'Trf.Bölge',
      'itinerary.room': 'Oda ',
      'itinerary.room_type': 'Oda Tipi',
      'itinerary.mealPlan': 'Pans ',
      'itinerary.checkInDate': 'Giriş Tarihi',
      'itinerary.checkOutDate': 'Çıkış Tarihi',
      operatorCode: 'Operatör',
      operatorName: 'Operatör Adı',
      voucher: 'Voucher',
      product: 'Grup1 Açıklama',
      status: 'Status',
      'groupCodes.grup1': 'Grup1 ',
      'groupCodes.grup2': 'Grup2 ',
      'groupCodes.grup3': 'Grup3 ',
      'groupCodes.grup4': 'Grup4 ',
      'groupCodes.grup5': 'Grup5 ',
      'notes.hotelNote': 'Otel Notu',
      'notes.voucherNote': 'Voucher Notu',
      'notes.internalNote': 'İntern Notu',
      'notes.transferNote': 'Trf. Notu',
      'notes.cancelNote': 'İptal Notu',
    };
    return map[field] || null;
  }
}
