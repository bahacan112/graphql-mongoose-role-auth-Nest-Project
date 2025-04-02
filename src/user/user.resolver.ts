import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles, Resource } from 'nest-keycloak-connect';

@Resolver(() => User)
@Resource('user-resource') // 👈 Bu satırı mutlaka ekle
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => User)
  async me(@Context('req') req: any): Promise<User> {
    const user = req.user;
    this.logger.debug(`Current user sub: ${user.sub}`);
    return this.userService.findOrCreateFromToken(user);
  }

  @ResolveField('profile')
  async profile(@Parent() user: User) {
    this.logger.debug(`Fetching profile for user ${user._id}`);
    return user.profile;
  }

  @Roles({ roles: ['admin'] })
  @Mutation(() => User)
  async updateUser(
    @Context('req') req: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = req.user;
    this.logger.debug(`Updating user ${user.sub}`);
    return this.userService.updateByKeycloakId(user.sub, updateUserInput);
  }

  @Roles({ roles: ['admin'] })
  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.userService.remove(id);
  }

  // ✅ Yeni Admin Sorgusu
  @Query(() => String)
  async adminTest(): Promise<string> {
    this.logger.debug('Admin tarafından erişildi.');
    return 'Sadece adminlerin görebileceği gizli veri';
  }
}
