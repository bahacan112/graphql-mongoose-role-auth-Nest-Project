import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext(); // GraphQL context
    const user = ctx?.req?.user; // Eğer auth varsa buradan user alınır

    let errorMessage = 'Beklenmeyen bir hata oluştu.';
    let statusCode = 500;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = exception.message;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    this.logger.error(
      `[HATA] ${user?.id || 'anon'} → (${statusCode}) ${errorMessage}`,
      (exception as any)?.stack || '',
    );

    // API'ye dönecek hata:
    return new InternalServerErrorException(errorMessage);
  }
}
