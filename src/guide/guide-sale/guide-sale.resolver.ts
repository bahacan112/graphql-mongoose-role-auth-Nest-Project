import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GuideSale } from 'src/schemas/guide-sale.schema';
import { GuideSaleService } from './guide-sale.service';
import { CreateGuideSaleInput } from './dto/create-guide-sale.input';
import { ID } from '@nestjs/graphql';

import { UpdateGuideSaleInput } from './dto/update-guide-sale.input';
@Resolver(() => GuideSale)
export class GuideSaleResolver {
  constructor(private readonly guideSaleService: GuideSaleService) {}

  @Mutation(() => GuideSale)
  createGuideSale(
    @Args('input') input: CreateGuideSaleInput,
  ): Promise<GuideSale> {
    return this.guideSaleService.create(input);
  }

  @Query(() => [GuideSale])
  guideSales(): Promise<GuideSale[]> {
    return this.guideSaleService.findAll();
  }

  @Query(() => [GuideSale])
  guideSalesByVoucher(
    @Args('combinedVoucher') combinedVoucher: string,
  ): Promise<GuideSale[]> {
    return this.guideSaleService.findByVoucher(combinedVoucher);
  }
  @Mutation(() => GuideSale)
  updateGuideSale(
    @Args('input') input: UpdateGuideSaleInput,
  ): Promise<GuideSale> {
    return this.guideSaleService.update(input);
  }

  @Mutation(() => GuideSale)
  deleteGuideSale(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GuideSale> {
    return this.guideSaleService.delete(id);
  }
}
