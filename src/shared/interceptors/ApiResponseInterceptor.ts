import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import type { Response } from 'express';
import { map, Observable } from 'rxjs';

import { PageDto } from '../dto';
import { TApiPaginatedResponse, TApiResponse } from '../types';

type TResponse = TApiResponse | TApiPaginatedResponse;

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor<
  unknown,
  TResponse
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TResponse> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<TResponse>;
    }

    const { statusCode } = context.switchToHttp().getResponse<Response>();
    const base = () => ({
      success: true as const,
      statusCode,
      timestamp: new Date().toISOString(),
    });

    return next
      .handle()
      .pipe(
        map((result: unknown): TResponse =>
          result instanceof PageDto
            ? { ...base(), data: result.items, meta: result.meta }
            : { ...base(), data: result ?? null },
        ),
      );
  }
}
