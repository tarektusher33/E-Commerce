import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'src/common/interfaces/response.interface';

export function createResponse<T>(  //? Here T is a generic type parameter
  data: T | null,
  message: string,
  statusCode: HttpStatus,
  error: string | null = null,
): ApiResponse<T> {
  return {
    data,
    error,
    message,
    statusCode,
  };
}
