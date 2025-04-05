import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
  async myGuide(@Args('telefon') telefon: string): Promise<Guide | null> {
    return this.guideService.findByUserId(telefon);
  }

  @Mutation(() => Guide)
  async createGuide(@Args('input') input: CreateGuideInput): Promise<Guide> {
    const userId = input.telefon; // artık cep numarası
    return this.guideService.create({ ...input, userId });
  }

  @Mutation(() => Boolean)
  async deleteGuide(@Args('id') id: string): Promise<boolean> {
    return this.guideService.delete(id);
  }
  @Mutation(() => Guide)
  async updateGuide(
    @Args('id') id: string,
    @Args('input') input: CreateGuideInput,
  ): Promise<Guide> {
    return this.guideService.update(id, input);
  }
}
