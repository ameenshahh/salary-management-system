import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

function getHttpStatus(exception: unknown): number {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

function getErrorMessage(exception: unknown): string {
  if (exception instanceof HttpException) {
    return exception.message;
  }
  return 'Internal server error';
}

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(GlobalExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = getHttpStatus(exception);
    const message = getErrorMessage(exception);

    if (status >= 500) {
      this.logger.error({ err: exception }, 'Unhandled exception');
    }

    const isProd = process.env.NODE_ENV === 'production';
    const detail =
      !isProd && exception instanceof Error ? exception.stack : undefined;

    response.status(status).json({ statusCode: status, message, detail });
  }
}
