import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    // Log error details
    this.logger.error(
      `[${timestamp}] ERROR ${method} ${path}:`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Prepare error response
    const errorResponse = {
      success: false,
      message: typeof message === 'string' ? message : (message as any).message,
      statusCode: status,
      timestamp,
      path,
      method,
    };

    // Add additional details for validation errors
    if (exception instanceof HttpException && typeof message === 'object') {
      const exceptionResponse = message as any;
      if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        errorResponse['errors'] = exceptionResponse.message;
      }
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse['stack'] =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(status).json(errorResponse);
  }
}
