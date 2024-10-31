import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import clc from 'cli-color';

import { ExtendedPrismaClient } from './core';

/**
 * Prisma 服务
 */
@Injectable()
export class PrismaService extends ExtendedPrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });
    /** 解决 Do not know how to serialize a BigInt 错误 */
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }
  onModuleDestroy() {
    this.$disconnect();
  }
  async onModuleInit() {
    this.$connect()
      .then(() => {
        console.log(clc.green('数据库连接成功'));
      })
      .catch((error) => {
        console.log(clc.red('数据库连接失败：'));
        console.error(error);
      });
  }
}
