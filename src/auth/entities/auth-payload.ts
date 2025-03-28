import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';

@ObjectType()
export class AuthPayload {
  @Field(() => ID)
  userId: string;

  @Field(() => Role)
  role: Role;

  @Field()
  accessToken: string;
}
