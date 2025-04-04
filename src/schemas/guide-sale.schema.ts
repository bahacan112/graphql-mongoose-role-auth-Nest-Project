// guide-sale.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class GuideSale extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  combinedVoucher: string;

  @Field()
  @Prop({ required: true })
  guideId: string; // ✅ EKLENDİ

  @Field()
  @Prop({ required: true })
  saleDate: Date;

  @Field()
  @Prop({ required: true })
  packageName: string;

  @Field(() => Int)
  @Prop({ required: true })
  quantity: number;

  @Field(() => Int)
  @Prop({ required: true })
  price: number;
}

export const GuideSaleSchema = SchemaFactory.createForClass(GuideSale);
