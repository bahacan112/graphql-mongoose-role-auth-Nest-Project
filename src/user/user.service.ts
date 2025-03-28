import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { hash } from 'argon2';
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

  async findOne(id: string): Promise<User> {
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

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await hash(createUserInput.password);

    const createdUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
    });

    const result = await createdUser.save();
    this.logger.save(
      `[${new Date().toISOString()}] Created user ${result._id}`,
      'UserService',
    );
    return result;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserInput, { new: true })
      .populate(['profile']);

    if (!user) {
      this.logger.warn(
        `[${new Date().toISOString()}] User ${id} not found for update`,
        'UserService',
      );
      throw new NotFoundException('User not found');
    }

    this.logger.save(
      `[${new Date().toISOString()}] Updated user ${id}`,
      'UserService',
    );
    return user;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (result) {
      this.logger.save(
        `[${new Date().toISOString()}] Removed user ${id}`,
        'UserService',
      );
    } else {
      this.logger.warn(
        `[${new Date().toISOString()}] Tried to remove non-existent user ${id}`,
        'UserService',
      );
    }
    return !!result;
  }
}
