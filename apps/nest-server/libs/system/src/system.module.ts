import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SysAuthModule, SysCacheModule, SysUserModule } from './modules';
import { CoreModule } from '@app/core';

@Module({
  imports: [CoreModule, SysAuthModule, SysUserModule, SysCacheModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
