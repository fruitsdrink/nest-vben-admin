import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { CommonModule } from '@app/common';
import { CacheModule } from '@nestjs/cache-manager';

/**
 * 应用配置模块
 */
@Global()
@Module({
  imports: [CommonModule, CacheModule.register()],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
