import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class GuideTourAssignment extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  guideId: string;

  @Field()
  @Prop({ required: true })
  tourId: string;
}

export const GuideTourAssignmentSchema =
  SchemaFactory.createForClass(GuideTourAssignment);
