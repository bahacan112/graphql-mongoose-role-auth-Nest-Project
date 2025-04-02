// auth/dto/auth-result.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResult {
  @Field()
  access_token: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field({ nullable: true })
  id_token?: string;

  @Field({ nullable: true })
  expires_in?: number;
}
