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
    /*     console.log(id, 'id');
    console.log(updateData, 'updateData');
 */ return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<GuideSale> {
    return this.model.findByIdAndDelete(id).exec();
  }
  async deleteByVoucher(combinedVoucher: string): Promise<number> {
    const result = await this.model.deleteMany({ combinedVoucher }).exec();
    return result.deletedCount || 0;
  }

  async updateByVoucher(
    combinedVoucher: string,
    update: Partial<GuideSale>,
  ): Promise<GuideSale[]> {
    await this.model.updateMany({ combinedVoucher }, update).exec();
    return this.model.find({ combinedVoucher }).exec();
  }
}
