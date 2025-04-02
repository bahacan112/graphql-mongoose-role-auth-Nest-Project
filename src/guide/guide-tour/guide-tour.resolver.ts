import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GuideTourAssignment } from 'src/schemas/guide-tour.schema';
import { GuideTourService } from './guide-tour.service';
import { CreateGuideTourInput } from '../dto/create-guide-tour.input';

@Resolver(() => GuideTourAssignment)
export class GuideTourResolver {
  constructor(private readonly service: GuideTourService) {}

  @Query(() => [GuideTourAssignment])
  async guideTours(
    @Args('guideId') guideId: string,
  ): Promise<GuideTourAssignment[]> {
    return this.service.findToursByGuide(guideId);
  }

  @Mutation(() => GuideTourAssignment)
  async assignTourToGuide(
    @Args('input') input: CreateGuideTourInput,
  ): Promise<GuideTourAssignment> {
    return this.service.assign(input);
  }
}
