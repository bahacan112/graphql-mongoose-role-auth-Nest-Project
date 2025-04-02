import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Package } from 'src/schemas/package.schema';
import { Model } from 'mongoose';
import { CreatePackageInput } from '../dto/create-package.input';

@Injectable()
export class PackageService {
  constructor(@InjectModel(Package.name) private model: Model<Package>) {}

  async create(input: CreatePackageInput): Promise<Package> {
    return this.model.create(input);
  }

  async findAll(): Promise<Package[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Package | null> {
    return this.model.findById(id).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
