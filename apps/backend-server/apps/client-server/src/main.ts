import 'reflect-metadata';

import clc from 'cli-color';
import cookieParser from 'cookie-parser';
import { boxen } from '@visulima/boxen';

import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { ClientServerModule } from './client-server.module';
import { AppConfigService } from './modules/system/app-config';
import { ResponseInterceptor } from '@app/common/interceptors';
import { HttpExceptionFilter } from '@app/common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(ClientServerModule);

  const appConfigService = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 只允许白名单
      forbidNonWhitelisted: true, // 禁止非白名单
      transform: true, // 启用转换
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          message: [error.constraints[Object.keys(error.constraints)[0]]],
        }));
        // 合并相同字段的错误信息
        const map = new Map();
        result.forEach((item) => {
          if (map.has(item.field)) {
            map.set(item.field, map.get(item.field).concat(item.message));
          } else {
            map.set(item.field, item.message);
          }
        });

        // 合并所有错误消息为字符串数组
        const messages = errors.map(
          (error) => error.constraints[Object.keys(error.constraints)[0]],
        );
        const errorList = Array.from(map).map(([field, message]) => ({
          field,
          message,
        }));
        // 将field转换为属性
        const errorObject = {};
        errorList.forEach((item) => {
          errorObject[item.field] = item.message;
        });

        const error = {
          statusCode: 400,
          errors: errorObject,
          messages,
        };

        const message = error.messages.join('，');
        return new BadRequestException({ ...error, message });
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());

  // 启用跨域
  if (appConfigService.appEnableCors) {
    app.enableCors({
      origin: appConfigService.appCorsOrigin,
      credentials: true,
    });
  }

  // 设置全局前缀
  if (appConfigService.appPrefix) {
    app.setGlobalPrefix(appConfigService.appPrefix);
  }

  // 启用版本控制
  if (appConfigService.appEnableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
  }

  const port = appConfigService.appPort;

  await app.listen(port, () => {
    console.log(callbackInfo(appConfigService));
  });
}
bootstrap();

const callbackInfo = (appConfigService: AppConfigService) => {
  const lines = [];
  lines.push(`${clc.blue('后台服务已启动 (client-server)')}`);

  const prefix = appConfigService.appPrefix ? `/${appConfigService.appPrefix}` : '';
  const version = appConfigService.appEnableVersion ? '/v1' : '';
  const url = clc.blue(`接口地址: http://localhost:${appConfigService.appPort}${prefix}${version}`);

  lines.push(url);

  const info = lines.join('\n');
  // return info;
  return boxen(info, {
    headerText: 'Nest-React-Admin',
    headerAlignment: 'center',
    padding: 1,
    margin: 1,
    borderStyle: 'double',
  });
};
