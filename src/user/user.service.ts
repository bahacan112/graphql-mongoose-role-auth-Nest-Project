import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserInput } from './dto/update-user.input';
import { LogService } from 'src/common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly logger: LogService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().populate(['profile']);
    this.logger.save(
      `[${new Date().toISOString()}] Fetched all users`,
      'UserService',
    );
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate(['profile']);
    if (!user) {
      this.logger.warn(
        `[${new Date().toISOString()}] User ${id} not found`,
        'UserService',
      );
      throw new NotFoundException('User not found');
    }

    this.logger.save(
      `[${new Date().toISOString()}] Fetched user ${id}`,
      'UserService',
    );
    return user;
  }

  async findByKeycloakId(sub: string): Promise<User | null> {
    return this.userModel.findOne({ keycloakId: sub }).populate(['profile']);
  }

  async findOrCreateFromToken(tokenPayload: any): Promise<User> {
    const { sub, preferred_username, email } = tokenPayload;

    const existing = await this.findByKeycloakId(sub);
    if (existing) return existing;

    const newUser = await this.userModel.create({
      keycloakId: sub,
      username: preferred_username,
      email,
    });

    this.logger.save(
      `[${new Date().toISOString()}] Created user ${newUser._id}`,
      'UserService',
    );
    return newUser;
  }

  async updateByKeycloakId(
    sub: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ keycloakId: sub }, updateUserInput, { new: true })
      .populate(['profile']);

    if (!user) {
      this.logger.warn(
        `[${new Date().toISOString()}] User ${sub} not found for update`,
        'UserService',
      );
      throw new NotFoundException('User not found');
    }

    this.logger.save(
      `[${new Date().toISOString()}] Updated user ${sub}`,
      'UserService',
    );
    return user;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id);
    const now = new Date().toISOString();

    if (result) {
      this.logger.save(`[${now}] Removed user ${id}`, 'UserService');
    } else {
      this.logger.warn(
        `[${now}] Tried to remove non-existent user ${id}`,
        'UserService',
      );
    }

    return !!result;
  }
}
