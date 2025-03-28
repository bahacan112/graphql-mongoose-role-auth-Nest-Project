import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { User } from 'src/schemas/user.schema'; // <-- Mongoose şeması
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt-guard/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserResolver.name);

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => User)
  async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => User)
  async me(@CurrentUser() user: JwtUser): Promise<User> {
    return this.userService.findOne(user.userId);
  }

  @ResolveField('profile')
  async profile(@Parent() user: User) {
    this.logger.debug(`Fetching profile for user ${user._id}`);
    return user.profile;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, RolesGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: JwtUser,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    this.logger.debug(`Updating user ${user.userId}`);
    return this.userService.update(user.userId, updateUserInput);
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, RolesGuard)
  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.userService.remove(id);
  }
}
