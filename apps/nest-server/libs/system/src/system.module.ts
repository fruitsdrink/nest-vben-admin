import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SysAuthModule } from './modules';

@Module({
  imports: [SysAuthModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
