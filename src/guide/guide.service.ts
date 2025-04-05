import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guide } from 'src/schemas/guide.schema';
import { Model } from 'mongoose';
import { CreateGuideInput } from './dto/create-guide.input';

@Injectable()
export class GuideService {
  constructor(@InjectModel(Guide.name) private guideModel: Model<Guide>) {}
  async create(input: CreateGuideInput & { userId: string }): Promise<Guide> {
    return this.guideModel.create(input);
  }

  async findAll(): Promise<Guide[]> {
    return this.guideModel.find().exec();
  }

  async findOne(id: string): Promise<Guide> {
    return this.guideModel.findById(id).exec();
  }
  async findByUserId(userId: string): Promise<Guide | null> {
    return this.guideModel.findOne({ userId });
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.guideModel.findByIdAndDelete(id).exec();
    return !!result;
  }
  async update(id: string, input: Partial<Guide>): Promise<Guide> {
    return this.guideModel.findByIdAndUpdate(id, input, { new: true }).exec();
  }
}
