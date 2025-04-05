import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://frontend-operation.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });
  // ✅ Upload middleware ÖNCE
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
      overrideSendResponse: false,
    }),
  );

  // Diğer global ayarlar
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  // ✅ En sonda listen çağrısı
  await app.listen(process.env.PORT || 3000);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
