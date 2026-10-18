import { Global, Module } from '@nestjs/common';

import { PrismaService } from './PrismaService';

@Global()
@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
