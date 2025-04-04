import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetReservationByVoucherInput {
  @Field()
  operatorCode: string;

  @Field()
  voucher: string;
}
