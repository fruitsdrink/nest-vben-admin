import { Module } from '@nestjs/common';
import { SysDepartmentService } from './department.service';

@Module({
  providers: [SysDepartmentService],
  exports: [SysDepartmentService],
})
export class SysDepartmentModule {}
