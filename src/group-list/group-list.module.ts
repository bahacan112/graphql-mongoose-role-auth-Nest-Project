import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UploadedRecord,
  UploadedRecordSchema,
} from '../schemas/uploaded-record.schema';
import { GroupListService } from './group-list.service';
import { GroupListResolver } from './group-list.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadedRecord.name, schema: UploadedRecordSchema },
    ]),
  ],
  providers: [GroupListService, GroupListResolver],
})
export class GroupListModule {}
