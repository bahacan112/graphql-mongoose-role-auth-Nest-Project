import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Guide } from './guide.schema'; // ✅ Guide modelini ekliyoruz
import { GuideSale } from './guide-sale.schema'; // ✅ Rehber satış modelini ekliyoruz
@ObjectType()
@Schema({ _id: false })
export class GroupCodes {
  @Field({ nullable: true })
  @Prop()
  grup1?: string;

  @Field({ nullable: true })
  @Prop()
  grup2?: string;

  @Field({ nullable: true })
  @Prop()
  grup3?: string;

  @Field({ nullable: true })
  @Prop()
  grup4?: string;

  @Field({ nullable: true })
  @Prop()
  grup5?: string;
}

@ObjectType()
@Schema({ _id: false })
export class Itinerary {
  @Field()
  @Prop({ required: true })
  segmentType: string;

  @Field({ nullable: true }) @Prop() hotelCode?: string;
  @Field({ nullable: true }) @Prop() hotelName?: string;
  @Field({ nullable: true }) @Prop() hotelType?: string;
  @Field({ nullable: true }) @Prop() region?: string;
  @Field({ nullable: true }) @Prop() transferRegion?: string;
  @Field({ nullable: true }) @Prop() room?: string;
  @Field({ nullable: true }) @Prop() room_type?: string;
  @Field({ nullable: true }) @Prop() mealPlan?: string;
  @Field({ nullable: true }) @Prop() checkInDate?: string;
  @Field({ nullable: true }) @Prop() checkOutDate?: string;
}

@ObjectType()
@Schema({ _id: false })
export class FlightInfo {
  @Field({ nullable: true }) @Prop() arrivalFrom?: string;
  @Field({ nullable: true }) @Prop() arrivalTo?: string;
  @Field({ nullable: true }) @Prop() arrivalFlightNo?: string;
  @Field({ nullable: true }) @Prop() arrivalPNR?: string;
  @Field({ nullable: true }) @Prop() arrivalFlightDate?: string;
  @Field({ nullable: true }) @Prop() arrivalFlightTime?: string;
  @Field({ nullable: true }) @Prop() departureFrom?: string;
  @Field({ nullable: true }) @Prop() departureTo?: string;
  @Field({ nullable: true }) @Prop() departureFlightNo?: string;
  @Field({ nullable: true }) @Prop() departurePNR?: string;
  @Field({ nullable: true }) @Prop() departureFlightDate?: string;
  @Field({ nullable: true }) @Prop() departureFlightTime?: string;
}

@ObjectType()
@Schema({ _id: false })
export class Passenger {
  @Field({ nullable: true }) @Prop() title?: string;
  @Field({ nullable: true }) @Prop() passengerIndex?: number;
  @Field({ nullable: true }) @Prop() fullName?: string;
  @Field({ nullable: true }) @Prop() birthday?: string;
  @Field({ nullable: true }) @Prop() passportNo?: string;
  @Field(() => FlightInfo, { nullable: true })
  @Prop()
  arrivalFlight?: FlightInfo;
  @Field(() => FlightInfo, { nullable: true })
  @Prop()
  departureFlight?: FlightInfo;
}

@ObjectType()
@Schema({ _id: false })
export class Notes {
  @Field({ nullable: true }) @Prop() hotelNote?: string;
  @Field({ nullable: true }) @Prop() voucherNote?: string;
  @Field({ nullable: true }) @Prop() internalNote?: string;
  @Field({ nullable: true }) @Prop() transferNote?: string;
  @Field({ nullable: true }) @Prop() cancelNote?: string;
}

@ObjectType()
@Schema({ collection: 'uploadedrecords', timestamps: true })
export class UploadedRecord {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  combinedVoucher: string;

  @Field()
  @Prop({ required: true })
  voucher: string;

  @Field()
  @Prop({ required: true })
  operatorCode: string;

  @Field({ nullable: true }) @Prop() operatorName?: string;
  @Field({ nullable: true }) @Prop() product?: string;
  @Field({ nullable: true }) @Prop() status?: string;

  @Field(() => Notes, { nullable: true })
  @Prop({ type: Notes })
  notes?: Notes;

  @Field(() => [Passenger], { nullable: true })
  @Prop({ type: [Passenger], default: [] })
  passengers?: Passenger[];

  @Field(() => [Itinerary], { nullable: true })
  @Prop({ type: [Itinerary], default: [] })
  itinerary?: Itinerary[];

  @Field(() => GroupCodes, { nullable: true })
  @Prop({ type: GroupCodes })
  groupCodes?: GroupCodes;

  @Field(() => Guide, { nullable: true }) // <-- rehber bilgisini dışarı açar
  assignedGuide?: Guide; // sadece GraphQL için, veritabanına yazılmaz

  @Field(() => [GuideSale], { nullable: true })
  guideSales?: GuideSale[];
}

export type UploadedRecordDocument = UploadedRecord & Document;
export const UploadedRecordSchema =
  SchemaFactory.createForClass(UploadedRecord);
