import { AppConfigModule, CoreModule } from '@app/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules';

/**
 * 客户端服务模块
 */
@Module({
  imports: [AppConfigModule.forRoot(), AuthModule, CoreModule],
})
export class ServerModule {}
