import { ModuleMetadata, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import consola from 'consola';
import type { SetupOptions, BootOptions } from '../types';
import { AppConfigService } from '../modules';

/**
 * 创建提示信息
 * @param options 配置选项
 * @returns
 */
const createTipInfo = (options: {
  appName: string;
  port: number;
  prefix?: string;
  version?: number;
}): string => {
  const { appName, port } = options;
  return `${chalk.green('➜')}  ${chalk.bold(appName)}: ${chalk.cyan(
    `http://localhost:${port}/api`,
  )}`;
};

/**
 * 设置应用实例
 * @param options 配置选项
 */
const setup = async (options: SetupOptions): Promise<void> => {
  const { app, appConfigService } = options;

  // 设置是否允许跨域
  if (appConfigService.app.enableCors && !appConfigService.app.corsOrigin) {
    app.enableCors({
      origin: appConfigService.app.corsOrigin,
      credentials: appConfigService.app.corsCredentials,
      methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    });
  }
};
/**
 * 启动应用实例
 * @param options 配置选项
 */
const boot = async (options: BootOptions): Promise<void> => {
  const { appName, mainModule, port } = options;
  const app = await NestFactory.create(mainModule);

  const appConfigService = app.get(AppConfigService);

  const appPort = port ?? appConfigService.app.port;

  await setup({ app, appConfigService });

  await app.listen(appPort, () => {
    consola.log(createTipInfo({ appName, port: 5321 }));
  });
};

export const AppFactory = {
  boot,
};
