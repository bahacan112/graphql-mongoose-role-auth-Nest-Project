import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'uploadedrecords', timestamps: true })
export class UploadedRecord {
  @Prop({ required: true })
  combinedVoucher: string;

  @Prop({ required: true })
  voucher: string;

  @Prop({ required: true })
  operatorCode: string;

  @Prop()
  operatorName: string;

  @Prop()
  product: string;

  @Prop()
  status: string;

  @Prop({
    type: {
      hotelNote: String,
      voucherNote: String,
      internalNote: String,
      transferNote: String,
      cancelNote: String,
    },
    default: {},
  })
  notes: {
    hotelNote: string;
    voucherNote: string;
    internalNote: string;
    transferNote: string;
    cancelNote: string;
  };

  @Prop({
    type: [
      {
        title: String,
        passengerIndex: Number,
        fullName: String,
        birthday: String,
        passportNo: String,
        arrivalFlight: {
          arrivalFrom: String,
          arrivalTo: String,
          arrivalFlightNo: String,
          arrivalPNR: String,
          arrivalFlightDate: String,
          arrivalFlightTime: String,
        },
        departureFlight: {
          departureFrom: String,
          departureTo: String,
          departureFlightNo: String,
          departurePNR: String,
          departureFlightDate: String,
          departureFlightTime: String,
        },
      },
    ],
    default: [],
  })
  passengers: {
    title: string;
    passengerIndex: number;
    fullName: string;
    birthday: string;
    passportNo: string;
    arrivalFlight: {
      arrivalFrom: string;
      arrivalTo: string;
      arrivalFlightNo: string;
      arrivalPNR: string;
      arrivalFlightDate: string;
      arrivalFlightTime: string;
    };
    departureFlight: {
      departureFrom: string;
      departureTo: string;
      departureFlightNo: string;
      departurePNR: string;
      departureFlightDate: string;
      departureFlightTime: string;
    };
  }[];

  @Prop({
    type: [
      {
        segmentType: String,
        hotelCode: String,
        hotelName: String,
        hotelType: String,
        region: String,
        transferRegion: String,
        room: String, // ✅ eksik
        room_type: String, // ✅ eksik
        mealPlan: String, // ✅ eksik
        checkInDate: String,
        checkOutDate: String,
      },
    ],
    default: [],
  })
  itinerary: {
    segmentType: string;
    hotelCode: string;
    hotelName: string;
    hotelType: string;
    region: string;
    transferRegion: string;
    room: string;
    room_type: string;
    mealPlan: string;
    checkInDate: string;
    checkOutDate: string;
  }[];

  @Prop({
    type: {
      grup1: String,
      grup2: String,
      grup3: String,
      grup4: String,
      grup5: String,
    },
  })
  groupCodes: {
    grup1: string;
    grup2: string;
    grup3: string;
    grup4: string;
    grup5: string;
  };
}

export type UploadedRecordDocument = UploadedRecord & Document;
export const UploadedRecordSchema =
  SchemaFactory.createForClass(UploadedRecord);
