import { AppConfigModule } from '@app/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules';

/**
 * 客户端服务模块
 */
@Module({
  imports: [AppConfigModule.forRoot(), AuthModule],
})
export class ServerModule {}
