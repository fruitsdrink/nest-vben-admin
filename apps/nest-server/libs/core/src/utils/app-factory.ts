import { string } from 'yup';
import 'reflect-metadata';
import {
  ClassSerializerInterceptor,
  VersioningType,
  ExceptionFilter,
  INestApplication,
  NestInterceptor,
  NestMiddleware,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import chalk from 'chalk';
import consola from 'consola';
import { SetupOptions, BootOptions, NestMiddlewareFn } from '../types';
import { AppConfigService } from '../modules';
import { HttpExceptionFilter, ResponseInterceptor } from '@app/common';
import cookieParser from 'cookie-parser';
import { nestValidatePipe } from '../pipes';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import fs from 'fs';

/**
 * 初始化拦截器
 * @param app 应用实例
 */
const initInterceptors = (app: INestApplication, interceptors?: NestInterceptor[]): void => {
  const globalInterceptors: NestInterceptor[] = [
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
    ...interceptors,
  ];
  app.useGlobalInterceptors(...globalInterceptors);
};

/**
 * 初始化中间件
 * @param app 应用实例
 * @param middlewares 中间件
 */
const initMiddlewares = (
  app: INestApplication,
  middlewares?: NestMiddleware[] | NestMiddlewareFn[],
): void => {
  const globalMiddlewares = [cookieParser(), ...middlewares];
  app.use(...globalMiddlewares);
};

/**
 * 初始化异常过滤器
 * @param app 应用实例
 * @param filters 异常过滤器
 */
const initExceptionFilter = (app: INestApplication, filters?: ExceptionFilter[]) => {
  const globalFilters = [new HttpExceptionFilter(), ...filters];
  app.useGlobalFilters(...globalFilters);
};

/**
 * 初始化跨域
 * @param app 应用实例
 * @param options 配置选项
 */
const initCors = (
  app: INestApplication,
  options: {
    enable: boolean;
    origin: string;
    credentials: boolean;
    methods: string;
  },
) => {
  if (options.enable && options.origin) {
    app.enableCors({
      origin: options.origin ?? '*',
      credentials: options.credentials,
      methods: options.methods ?? 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    });
  }
};

/**
 * 设置地址前缀
 * @param app 应用实例
 * @param prefix 地址前缀
 */
const initPrefix = (app: INestApplication, prefix?: string) => {
  if (prefix) {
    app.setGlobalPrefix(prefix);
  }
};

/**
 * 设置版本
 * @param app 应用实例
 * @param version 版本
 */
const initVersion = (app: INestApplication, version?: boolean) => {
  if (version) {
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
    });
  }
};

/**
 * 初始化管道
 * @param app 应用实例
 * @param pipes 管道
 */
const initPipes = (app: INestApplication, pipes?: PipeTransform[]) => {
  const globalPipes = [nestValidatePipe, ...pipes];
  app.useGlobalPipes(...globalPipes);
};

/**
 * 初始化静态资源
 * @param app 应用实例
 * @param appConfigService 配置服务
 * @param options 配置选项
 */
const intiStaticAssets = (
  app: NestExpressApplication,
  appConfigService: AppConfigService,
  options?: {
    path: string;
    prefix: string;
  },
) => {
  const defaultOptions = {
    path: 'public',
    prefix: '/public/',
  };
  const { path, prefix } = { ...defaultOptions, ...options };
  const staticPath = join(process.cwd(), path);
  const imagePath = join(staticPath, 'images'); // 图片路径
  const uploadPath = join(staticPath, 'upload'); // 上传文件路径
  const avatarPath = join(staticPath, 'avatar'); // 头像路径
  // 创建文件夹
  fs.mkdirSync(staticPath, { recursive: true });
  fs.mkdirSync(imagePath, { recursive: true });
  fs.mkdirSync(uploadPath, { recursive: true });
  fs.mkdirSync(avatarPath, { recursive: true });

  app.useStaticAssets(path, {
    prefix,
  });

  return {
    staticPath: prefix,
  };
};

/**
 * 创建提示信息
 * @param options 配置选项
 * @returns
 */
const getPrintInfo = (options: {
  appName: string;
  port: number;
  prefix?: string;
  version?: boolean;
}): { printInfo: string; apiUrl: string; host: string } => {
  const { appName, port, prefix, version } = options;
  const url = `http://localhost:${port}`;
  const prefixInfo = prefix ? `/${prefix}` : '';
  const versionInfo = version ? '/v1' : '';
  const apiUrl = `${url}${prefixInfo}${versionInfo}`;
  const printInfo = `${chalk.green('➜')}  ${chalk.bold(appName)}: ${chalk.cyan(apiUrl)}`;
  return { printInfo, apiUrl, host: url };
};

/**
 * 设置应用实例
 * @param options 配置选项
 */
const setup = async (options: SetupOptions) => {
  const {
    app,
    appConfigService,
    interceptors = [],
    middlewares = [],
    filters = [],
    pipes = [],
  } = options;

  const port = options.port ?? appConfigService.app.port;

  const { printInfo, apiUrl, host } = getPrintInfo({
    appName: options.appName,
    port,
    prefix: appConfigService.app.prefix,
    version: appConfigService.app.enableVersion,
  });

  // 初始化静态资源
  const { staticPath } = intiStaticAssets(app, appConfigService);

  appConfigService.apiUrl = apiUrl;
  appConfigService.host = host;
  appConfigService.publicPath = staticPath;

  // 初始化跨域
  initCors(app, {
    enable: appConfigService.app.enableCors,
    origin: appConfigService.app.corsOrigin,
    credentials: appConfigService.app.corsCredentials,
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  });

  // 初始化拦截器
  initInterceptors(app, interceptors);

  // 初始化中间件
  initMiddlewares(app, middlewares);

  // 初始化异常过滤器
  initExceptionFilter(app, filters);

  // 初始化管道
  initPipes(app, pipes);

  // 设置地址前缀
  initPrefix(app, appConfigService.app.prefix);

  // 设置版本
  initVersion(app, appConfigService.app.enableVersion);

  return {
    port,
    printInfo,
  };
};
/**
 * 启动应用实例
 * @param options 配置选项
 */
const boot = async (options: BootOptions): Promise<void> => {
  const { appName, mainModule, interceptors, middlewares, filters, pipes } = options;
  const app = await NestFactory.create<NestExpressApplication>(mainModule);

  const appConfigService = app.get(AppConfigService);

  const { port, printInfo } = await setup({
    app,
    appConfigService,
    port: options.port,
    appName,
    interceptors,
    middlewares,
    filters,
    pipes,
  });

  await app.listen(port, () => {
    consola.log(printInfo);
  });
};

export const AppFactory = {
  boot,
};
