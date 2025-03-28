import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from 'src/schemas/log.shema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<LogDocument>,
  ) {}

  async save(userId: string, action: string, payload?: any, context?: string) {
    await this.logModel.create({
      userId,
      action,
      payload,
      context,
    });
  }
  async warn(userId: string, action: string, payload?: any, context?: string) {
    await this.save(userId, `[WARN] ${action}`, payload, context);
  }
  async debug(userId: string, action: string, payload?: any, context?: string) {
    await this.save(userId, `[DEBUG] ${action}`, payload, context);
  }
}
