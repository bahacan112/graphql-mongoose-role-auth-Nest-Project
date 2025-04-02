import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GuideSale } from 'src/schemas/guide-sale.schema';
import { GuideSaleService } from './guide-sale.service';
import { CreateGuideSaleInput } from '../dto/create-guide-sale.input';

@Resolver(() => GuideSale)
export class GuideSaleResolver {
  constructor(private readonly service: GuideSaleService) {}

  @Query(() => [GuideSale])
  async guideSalesByGuide(
    @Args('guideId') guideId: string,
  ): Promise<GuideSale[]> {
    return this.service.findByGuideId(guideId);
  }

  @Query(() => [GuideSale])
  async guideSalesByTour(@Args('tourId') tourId: string): Promise<GuideSale[]> {
    return this.service.findByTourId(tourId);
  }

  @Mutation(() => GuideSale)
  async recordGuideSale(
    @Args('input') input: CreateGuideSaleInput,
  ): Promise<GuideSale> {
    return this.service.recordSale(input);
  }
}
