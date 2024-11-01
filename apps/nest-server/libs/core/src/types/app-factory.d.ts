import type { INestApplication } from '@nestjs/common';
import type { AppConfigService } from '../modules';

export type SetupOptions = {
  /**
   * 应用实例
   */
  app: INestApplication;
  appConfigService: AppConfigService;
};

export type BootOptions = {
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 主模块
   */
  mainModule: any;
  /**
   *
   */
  port?: number;
};
