import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGuideInput {
  @Field({ nullable: true }) kimlikNo?: string;
  @Field() adSoyad: string;
  @Field() telefon: string;
  @Field(() => [String]) diller: string[];
  @Field(() => [String]) rehberTipi: string[];
  @Field() bolgeKodu: string;
}
