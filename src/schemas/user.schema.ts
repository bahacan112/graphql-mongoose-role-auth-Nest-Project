import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';
import { Post } from './post.schema';
import { Profile } from './profile.schema';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field(() => Role)
  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop()
  password: string;

  @Field(() => Profile, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Profile' })
  profile?: Profile;

  @Field(() => [Post], { nullable: 'itemsAndList' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  posts?: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
