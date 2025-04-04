import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GuideTourAssignment } from 'src/schemas/guide-tour.schema';
import { Model } from 'mongoose';
import { CreateGuideTourInput } from '../dto/create-guide-tour.input';

@Injectable()
export class GuideTourService {
  constructor(
    @InjectModel(GuideTourAssignment.name)
    private model: Model<GuideTourAssignment>,
  ) {}

  async assign(input: CreateGuideTourInput): Promise<GuideTourAssignment> {
    const existing = await this.model.findOne({
      grup1: input.grup1,
      grup2: input.grup2,
      grup5: input.grup5,
    });

    if (existing) {
      // Rehberi güncelle
      existing.guideId = input.guideId;
      await existing.save();
      return existing;
    }

    // Yeni kayıt
    return this.model.create(input);
  }

  async findToursByGuide(guideId: string): Promise<GuideTourAssignment[]> {
    return this.model.find({ guideId }).exec();
  }

  async update(
    id: string,
    update: Partial<CreateGuideTourInput>,
  ): Promise<GuideTourAssignment | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
  async findByGroup(
    grup1: string,
    grup2: string,
    grup5: string,
  ): Promise<GuideTourAssignment | null> {
    return this.model.findOne({ grup1, grup2, grup5 }).exec();
  }
}
