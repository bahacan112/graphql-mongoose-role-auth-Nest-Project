import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.schema';

export type TagDocument = Tag & Document;

@Schema()
@ObjectType()
export class Tag {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field(() => [Post], { nullable: 'itemsAndList' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  posts?: (Types.ObjectId | Post)[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
