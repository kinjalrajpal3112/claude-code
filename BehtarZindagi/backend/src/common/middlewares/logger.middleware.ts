import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const timestamp = new Date().toISOString();

    // Log request
    this.logger.log(
      `[${timestamp}] ${method} ${originalUrl} - IP: ${ip} - UA: ${userAgent}`,
    );

    // Add request start time for response time calculation
    const startTime = Date.now();

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      // Log response
      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
      );

      return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
  }
}
