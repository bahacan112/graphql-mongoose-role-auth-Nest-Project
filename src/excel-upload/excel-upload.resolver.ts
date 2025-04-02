import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts'; // interface burada var!
import { ExcelUploadService } from './excel-upload.service';

@Resolver()
export class ExcelUploadResolver {
  constructor(private readonly excelUploadService: ExcelUploadService) {}

  @Mutation(() => Boolean)
  async uploadExcel(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<boolean> {
    const buffer = await this.readStreamToBuffer(file.createReadStream());
    console.log('istek geldi');
    return this.excelUploadService.processExcel(buffer);
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
