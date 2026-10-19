import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ZodSerializerInterceptor } from 'nestjs-zod';

import { GlobalExceptionsFilter } from '@/shared/filters';
import { ApiResponseInterceptor } from '@/shared/interceptors';
import { GlobalValidationPipe } from '@/shared/pipes';
import { PrismaModule } from '@/shared/prisma';

import { validateEnv } from '@/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: GlobalValidationPipe },
  ],
})
export class AppModule {}
