import type { INestApplication } from '@nestjs/common';

export type SetupOptions = {
  /**
   * 应用实例
   */
  app: INestApplication;
  /**
   * 端口
   */
  port: number;
};

export type BootOptions = Pick<AppFactoryOptions, 'appName' | 'mainModule'>;
