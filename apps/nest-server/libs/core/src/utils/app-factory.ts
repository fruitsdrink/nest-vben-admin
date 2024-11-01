import { ModuleMetadata, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import consola from 'consola';
import type { SetupOptions, BootOptions } from '../types';

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
  const { app, port } = options;
};
/**
 * 启动应用实例
 * @param options 配置选项
 */
const boot = async (options: BootOptions): Promise<void> => {
  const { appName, mainModule } = options;
  const app = await NestFactory.create(mainModule);

  await setup({ app, port: 5321 });

  await app.listen(5321, () => {
    consola.log(createTipInfo({ appName, port: 5321 }));
  });
};

export const AppFactory = {
  boot,
};
