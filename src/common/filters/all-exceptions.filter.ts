import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const req = ctx.req;

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;
    const user = req?.user || { userId: 'Anonymous' };

    this.logger.error({
      user,
      path: req?.url,
      method: req?.method,
      status,
      error: errorResponse,
    });

    throw exception;
  }
}
