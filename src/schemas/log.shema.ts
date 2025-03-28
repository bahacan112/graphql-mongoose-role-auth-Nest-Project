import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Log {
  @Field()
  @Prop({ required: true })
  userId: string;

  @Field()
  @Prop({ required: true })
  action: string;

  @Field({ nullable: true })
  @Prop()
  context?: string;

  @Field(() => Object, { nullable: true })
  @Prop({ type: Object })
  payload?: any;
}

export type LogDocument = Log & Document;
export const LogSchema = SchemaFactory.createForClass(Log);
