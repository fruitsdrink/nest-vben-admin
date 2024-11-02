import { Global, Module } from '@nestjs/common';
import { SysCacheService } from './cache.service';

/**
 * 系统缓存模块
 */
@Global()
@Module({
  providers: [SysCacheService],
  exports: [SysCacheService],
})
export class SysCacheModule {}
