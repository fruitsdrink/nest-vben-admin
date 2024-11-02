import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from './modules';
import { CacheModule } from './modules/cache/cache.module';

/**
 * Nest Server 核心模块
 */
@Module({
  imports: [PrismaModule, CacheModule],
})
export class CoreModule {}
