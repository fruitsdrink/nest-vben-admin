import { AppConfigModule } from '@app/core';
import { Module } from '@nestjs/common';

/**
 * 客户端服务模块
 */
@Module({
  imports: [AppConfigModule.forRoot()],
})
export class ServerModule {}
