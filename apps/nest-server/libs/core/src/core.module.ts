import { Module } from '@nestjs/common';
import { NestCacheModule, PrismaModule } from './modules';

/**
 * Nest Server 核心模块
 */
@Module({
  imports: [PrismaModule, NestCacheModule],
})
export class CoreModule {}
