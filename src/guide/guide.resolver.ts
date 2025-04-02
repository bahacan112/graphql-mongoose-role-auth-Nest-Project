import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GuideService } from './guide.service';
import { Guide } from 'src/schemas/guide.schema';
import { CreateGuideInput } from './dto/create-guide.input';

@Resolver(() => Guide)
export class GuideResolver {
  constructor(private readonly guideService: GuideService) {}

  @Query(() => [Guide])
  async guides(): Promise<Guide[]> {
    return this.guideService.findAll();
  }

  @Query(() => Guide, { nullable: true })
  async guide(@Args('id') id: string): Promise<Guide | null> {
    return this.guideService.findOne(id);
  }

  @Query(() => Guide, { nullable: true })
  async myGuide(@Context() context): Promise<Guide | null> {
    const userId = context.req.user.userId;
    return this.guideService.findByUserId(userId);
  }

  @Mutation(() => Guide)
  async createGuide(
    @Args('input') input: CreateGuideInput,
    @Context() context,
  ): Promise<Guide> {
    const userId = context.req.user.userId;
    return this.guideService.create({ ...input, userId });
  }
}
