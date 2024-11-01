import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from './modules';

/**
 * Nest Server 核心模块
 */
@Module({
  imports: [PrismaModule],
})
export class CoreModule {}
