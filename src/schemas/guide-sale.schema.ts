import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class GuideSale extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  guideId: string;

  @Field()
  @Prop({ required: true })
  tourId: string;

  @Field()
  @Prop({ required: true })
  packageId: string;

  @Field()
  @Prop({ required: true })
  quantity: number;

  @Field()
  @Prop({ default: () => new Date() })
  saleDate: Date;
}

export const GuideSaleSchema = SchemaFactory.createForClass(GuideSale);
