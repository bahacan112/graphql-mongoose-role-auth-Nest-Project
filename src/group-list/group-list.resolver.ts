import { Resolver, Query } from '@nestjs/graphql';
import { GroupListService } from './group-list.service';

@Resolver()
export class GroupListResolver {
  constructor(private readonly groupListService: GroupListService) {}

  @Query(() => [String])
  async groupKeys(): Promise<string[]> {
    return this.groupListService.getGroupKeys();
  }
}
