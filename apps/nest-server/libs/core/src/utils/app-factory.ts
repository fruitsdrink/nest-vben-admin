import { ModuleMetadata, VersioningType, type INestApplication } from '@nestjs/common';
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
  version?: boolean;
}): string => {
  const { appName, port, prefix, version } = options;
  const url = `http://localhost:${port}`;
  const prefixInfo = prefix ? `/${prefix}` : '';
  const versionInfo = version ? '/v1' : '';
  return `${chalk.green('➜')}  ${chalk.bold(appName)}: ${chalk.cyan(
    `${url}${prefixInfo}${versionInfo}`,
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

  // 设置地址前缀
  if (appConfigService.app.prefix) {
    app.setGlobalPrefix(appConfigService.app.prefix);
  }

  if (appConfigService.app.enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
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
    consola.log(
      createTipInfo({
        appName,
        port: appConfigService.app.port,
        prefix: appConfigService.app.prefix,
        version: appConfigService.app.enableVersion,
      }),
    );
  });
};

export const AppFactory = {
  boot,
};
