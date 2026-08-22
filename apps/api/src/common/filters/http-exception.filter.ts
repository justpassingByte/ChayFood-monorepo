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
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isProd = process.env.NODE_ENV === 'production';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Lỗi máy chủ nội bộ, vui lòng thử lại sau';
    let error = 'Internal Server Error';
    let issues: Array<{ field: string; message: string }> | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        if (obj.message) {
          message = obj.message as string | string[];
        }
        if (obj.error) {
          error = obj.error as string;
        }
        if (Array.isArray(obj.issues)) {
          issues = obj.issues as Array<{ field: string; message: string }>;
        }
      }
    } else if (exception instanceof Error) {
      /**
       * Phòng thủ Information Disclosure & SQL Leak:
       * Ở môi trường Development: Trả về exception.message để lập trình viên dễ dàng debug.
       * Ở môi trường Production: Tuyệt đối ẨN toàn bộ chi tiết Database / SQL query / file path,
       * chỉ trả về thông điệp chung an toàn cho Client, đồng thời ghi đầy đủ Stack trace vào Log máy chủ.
       */
      message = isProd ? 'Đã xảy ra sự cố hệ thống, vui lòng thử lại sau' : exception.message;
      error = isProd ? 'Internal Server Error' : exception.name;
    }

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (issues && issues.length > 0) {
      errorResponse.issues = issues;
    }

    const logDetails = issues
      ? ` | Chi tiết: ${issues.map((i) => `${i.field}: ${i.message}`).join('; ')}`
      : '';

    const logMessage = `[${request.method}] ${request.url} ➔ ${status} ${error}: ${
      Array.isArray(message) ? message.join(', ') : message
    }${logDetails}`;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : undefined
      );
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(logMessage);
    }

    response.status(status).json(errorResponse);
  }
}
