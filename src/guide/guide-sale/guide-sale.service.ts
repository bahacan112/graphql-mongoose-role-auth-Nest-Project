import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GuideSale } from 'src/schemas/guide-sale.schema';
import { Model } from 'mongoose';
import { CreateGuideSaleInput } from './dto/create-guide-sale.input';
import { UpdateGuideSaleInput } from './dto/update-guide-sale.input';
@Injectable()
export class GuideSaleService {
  constructor(@InjectModel(GuideSale.name) private model: Model<GuideSale>) {}

  async create(input: CreateGuideSaleInput): Promise<GuideSale> {
    const created = new this.model(input);
    return created.save();
  }

  async findAll(): Promise<GuideSale[]> {
    return this.model.find().exec();
  }

  async findByVoucher(voucher: string): Promise<GuideSale[]> {
    return this.model.find({ combinedVoucher: voucher }).exec();
  }
  async update(input: UpdateGuideSaleInput): Promise<GuideSale> {
    const { id, ...updateData } = input;
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<GuideSale> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
