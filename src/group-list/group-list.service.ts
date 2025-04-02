import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UploadedRecord,
  UploadedRecordDocument,
} from '../schemas/uploaded-record.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupListService {
  constructor(
    @InjectModel(UploadedRecord.name)
    private uploadedModel: Model<UploadedRecordDocument>,
  ) {}

  async getGroupKeys(): Promise<string[]> {
    const all = await this.uploadedModel.find({}, { groupCodes: 1 }).lean();
    const set = new Set<string>();

    for (const doc of all) {
      const { grup1, grup2, grup5 } = doc.groupCodes || {};
      if (grup1 && grup2 && grup5) {
        set.add(`${grup1}-${grup2}-${grup5}`);
      }
    }

    return Array.from(set).sort();
  }
}
