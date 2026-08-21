import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface BaseZodSchema<T = unknown> {
  parse(data: unknown): T;
}

interface ZodErrorLike {
  issues?: Array<{ path: Array<string | number>; message: string }>;
  errors?: Array<{ path: Array<string | number>; message: string }>;
}

@Injectable()
export class ZodValidationPipe<T = unknown> implements PipeTransform<unknown, T> {
  constructor(private schema: BaseZodSchema<T>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (typeof error === 'object' && error !== null && ('issues' in error || 'errors' in error)) {
        const errObj = error as ZodErrorLike;
        const issues = (errObj.issues || errObj.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const primaryMessage = issues[0]?.message || 'Dữ liệu gửi lên không đúng định dạng';

        throw new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: primaryMessage,
          issues,
        });
      }
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }
}
