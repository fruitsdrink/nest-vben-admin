import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

/**
 * 验证码模块
 */
@Module({
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
