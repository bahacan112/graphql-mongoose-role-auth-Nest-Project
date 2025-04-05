import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/schemas/user.schema';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload';
import { SignInInput } from './dto/signIn.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(@Args('input') input: CreateUserInput) {
    /*     console.log('service istek geldi');
     */
    return this.authService.registerUser(input);
  }

  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput, @Context() context) {
    const user = await this.authService.validateLocalUser(input);
    const result = await this.authService.login(user);

    // Opsiyonel: JWT token'ı cookie olarak yaz
    context.res.cookie('Authentication', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 gün
    });

    return result;
  }
}
