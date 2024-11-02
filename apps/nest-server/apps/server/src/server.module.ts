import { AppConfigModule, CoreModule } from '@app/core';
import { Module } from '@nestjs/common';
import { AuthModule, UserModule } from './modules';

/**
 * 客户端服务模块
 */
@Module({
  imports: [AppConfigModule.forRoot(), AuthModule, CoreModule, UserModule],
})
export class ServerModule {}
