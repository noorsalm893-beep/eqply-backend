import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { requestId?: string }>();
    const res = ctx.getResponse<Response>();

    const requestId = req.requestId || req.headers['x-request-id']?.toString();
    const path = (req.originalUrl || req.url || '').toString();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
    const isProd = nodeEnv === 'production';

    const message = isHttpException
      ? exception.message
      : isProd
        ? 'Internal server error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;
    const logLine = `${req.method} ${path} -> ${status}${requestId ? ` requestId=${requestId}` : ''}`;

    if (status >= 500) this.logger.error(logLine, stack || String(exception));
    else this.logger.warn(logLine);

    res.status(status).json({
      statusCode: status,
      message,
      ...(requestId ? { requestId } : {}),
      timestamp: new Date().toISOString(),
      path,
    });
  }
}

