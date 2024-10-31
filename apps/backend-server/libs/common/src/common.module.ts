import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { modules } from './modules';
import { PrismaModule } from './modules/prisma';

@Module({
  imports: [...modules],
  providers: [CommonService],
  exports: [CommonService, PrismaModule],
})
export class CommonModule {}
