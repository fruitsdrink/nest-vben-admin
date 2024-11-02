import { Global, Module } from '@nestjs/common';
import { SysAuthService } from './auth.service';

@Module({
  providers: [SysAuthService],
  exports: [SysAuthService],
})
export class SysAuthModule {}
