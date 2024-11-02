import { Module } from '@nestjs/common';
import { SysUserService } from './user.service';

/**
 * 系统用户模块
 */
@Module({
  providers: [SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}
