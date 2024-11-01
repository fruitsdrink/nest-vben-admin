import { Module, type DynamicModule } from '@nestjs/common';
import { NestAuthService } from './auth.service';

/**
 * 认证授权模块
 */
@Module({
  providers: [NestAuthService],
  exports: [NestAuthService],
})
export class NestAuthModule {
  static forFeature(): DynamicModule {
    return {
      module: NestAuthModule,
    };
  }
}
