import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GuideSale } from 'src/schemas/guide-sale.schema';
import { Model } from 'mongoose';
import { CreateGuideSaleInput } from '../dto/create-guide-sale.input';

@Injectable()
export class GuideSaleService {
  constructor(@InjectModel(GuideSale.name) private model: Model<GuideSale>) {}

  async recordSale(input: CreateGuideSaleInput): Promise<GuideSale> {
    const payload = {
      ...input,
      saleDate: input.saleDate ?? new Date(),
    };
    return this.model.create(payload);
  }

  async findByGuideId(guideId: string): Promise<GuideSale[]> {
    return this.model.find({ guideId }).exec();
  }

  async findByTourId(tourId: string): Promise<GuideSale[]> {
    return this.model.find({ tourId }).exec();
  }
}
