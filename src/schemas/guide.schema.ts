import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType() // GraphQL için
@Schema() // Mongoose için
export class Guide extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  adSoyad: string;

  @Field({ nullable: true })
  @Prop()
  kimlikNo?: string;

  @Field()
  @Prop({ required: true })
  telefon: string;

  @Field(() => [String])
  @Prop([String])
  diller: string[];

  @Field(() => [String])
  @Prop([String])
  rehberTipi: string[];

  @Field()
  @Prop()
  bolgeKodu: string;

  @Field()
  @Prop({ required: true })
  userId: string;
}

export const GuideSchema = SchemaFactory.createForClass(Guide);
