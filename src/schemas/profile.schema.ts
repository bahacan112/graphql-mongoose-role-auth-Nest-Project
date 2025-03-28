import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema'; // Mongoose User şeması

export type ProfileDocument = Profile & Document;

@Schema()
@ObjectType()
export class Profile {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  bio: string;

  @Field()
  @Prop({ required: true })
  avatar: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
