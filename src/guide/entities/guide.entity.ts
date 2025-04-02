// src/guide/entities/guide.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Guide {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  kimlikNo?: string;

  @Field()
  adSoyad: string;

  @Field()
  telefon: string;

  @Field(() => [String])
  diller: string[];

  @Field(() => [String])
  rehberTipi: string[];

  @Field()
  bolgeKodu: string;
}
