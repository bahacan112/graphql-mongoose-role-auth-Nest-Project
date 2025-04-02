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
    return this.model.create(input);
  }

  async findToursByGuide(guideId: string): Promise<GuideTourAssignment[]> {
    return this.model.find({ guideId }).exec();
  }
}
