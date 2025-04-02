import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';
import { ExcelUpdateSelectedService } from './excel-update.selected.service';
import { GraphQLString } from 'graphql';

@Resolver()
export class ExcelUploadSelectedResolver {
  constructor(
    private readonly excelUploadSelectedService: ExcelUpdateSelectedService,
  ) {}

  @Mutation(() => Boolean)
  async updateSelectedFieldsFromExcel(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: 'fields', type: () => [GraphQLString] }) fields: string[],
  ): Promise<boolean> {
    const buffer = await this.readStreamToBuffer(file.createReadStream());
    return this.excelUploadSelectedService.updateSelectedFields(buffer, fields);
  }

  private async readStreamToBuffer(
    stream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
