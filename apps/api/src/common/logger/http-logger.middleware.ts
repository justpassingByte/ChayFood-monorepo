import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '-';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const contentLength = res.get('content-length') || '0';

      // ANSI Color codes
      const reset = '\x1b[0m';
      const green = '\x1b[32m';
      const yellow = '\x1b[33m';
      const red = '\x1b[31m';
      const cyan = '\x1b[36m';
      const bold = '\x1b[1m';

      let statusColor = green;
      if (statusCode >= 500) {
        statusColor = red;
      } else if (statusCode >= 400) {
        statusColor = yellow;
      } else if (statusCode >= 300) {
        statusColor = cyan;
      }

      const formattedLog = `${bold}${method}${reset} ${originalUrl} ${statusColor}${bold}${statusCode}${reset} - ${duration}ms (${contentLength} bytes) [${ip}]`;

      if (statusCode >= 500) {
        this.logger.error(formattedLog);
      } else if (statusCode >= 400) {
        this.logger.warn(formattedLog);
      } else {
        this.logger.log(formattedLog);
      }
    });

    next();
  }
}
