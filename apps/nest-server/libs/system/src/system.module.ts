import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SysAuthModule, SysCacheModule, SysDepartmentModule, SysUserModule } from './modules';
import { CoreModule } from '@app/core';

@Module({
  imports: [CoreModule, SysAuthModule, SysUserModule, SysCacheModule, SysDepartmentModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
