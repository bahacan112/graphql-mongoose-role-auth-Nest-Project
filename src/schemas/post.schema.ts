import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from './user.schema';
import { Tag } from './tag.schema';

export type PostDocument = Post & Document;

@Schema()
@ObjectType()
export class Post {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Field(() => [Tag])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: (Types.ObjectId | Tag)[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
