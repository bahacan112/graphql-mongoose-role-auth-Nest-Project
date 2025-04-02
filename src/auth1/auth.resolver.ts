// auth/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResult } from './dto/auth-result-dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResult)
  async exchangeCodeForToken(@Args('code') code: string): Promise<AuthResult> {
    return await this.authService.exchangeCodeForToken(code);
  }
}
