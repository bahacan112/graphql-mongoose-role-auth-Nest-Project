import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from 'argon2';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from 'src/schemas/user.schema';
import { Role } from 'src/enums/role.enum';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { SignInInput } from './dto/signIn.input';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { AuthPayload } from './entities/auth-payload';
import { JwtUser } from './types/jwt-user';
import { LogService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly logger: LogService,
  ) {}

  async registerUser(input: CreateUserInput): Promise<User> {
    const hashedPassword = await hash(input.password);
    const newUser = new this.userModel({
      ...input,
      password: hashedPassword,
      role: Role.USER,
    });
    const result = await newUser.save();
    this.logger.save(
      `[${new Date().toISOString()}] Registered new user ${result._id}`,
      'AuthService',
    );
    return result;
  }

  async validateLocalUser({ email, password }: SignInInput): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn(
        `[${new Date().toISOString()}] Login failed: User not found - ${email}`,
        'AuthService',
      );
      throw new UnauthorizedException('User not found');
    }

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched) {
      this.logger.warn(
        `[${new Date().toISOString()}] Login failed: Invalid credentials for ${email}`,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.save(
      `[${new Date().toISOString()}] User ${user._id} logged in`,
      'AuthService',
    );
    return user;
  }

  async generateToken(userId: string): Promise<{ accessToken: string }> {
    const payload: AuthJwtPayload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.debug(
      `[${new Date().toISOString()}] Generated token for user ${userId}`,
      'AuthService',
    );
    return { accessToken };
  }

  async login(user: User): Promise<AuthPayload> {
    const { accessToken } = await this.generateToken(user._id);

    this.logger.save(
      `[${new Date().toISOString()}] User ${user._id} completed login`,
      'AuthService',
    );

    return {
      userId: user._id,
      role: user.role,
      accessToken,
    };
  }

  async validateJwtUser(userId: string): Promise<JwtUser> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      this.logger.warn(
        `[${new Date().toISOString()}] JWT validation failed: User ${userId} not found`,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.debug(
      `[${new Date().toISOString()}] JWT validated for user ${userId}`,
      'AuthService',
    );

    const jwtUser: JwtUser = {
      userId: user._id,
      role: user.role,
    };

    return jwtUser;
  }
}
