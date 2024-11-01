import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 数据库Prisma模块
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}