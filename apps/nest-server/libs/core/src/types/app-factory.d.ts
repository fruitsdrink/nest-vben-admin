import type { INestApplication } from '@nestjs/common';
import type { AppConfigService } from '../modules';

export type SetupOptions = {
  /**
   * 应用实例
   */
  app: INestApplication;
  /**
   * 端口号
   */
  port: number;
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用配置服务
   */
  appConfigService: AppConfigService;
  /**
   * 拦截器
   */
  interceptors?: NestInterceptor[];
  /**
   * 中间件
   */
  middlewares?: NestMiddleware[] | NestMiddlewareFn[];
  /**
   * 异常过滤器
   */
  filters?: ExceptionFilter[];
  /**
   * 管道
   */
  pipes?: PipeTransform[];
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

  /**
   * 拦截器
   */
  interceptors?: NestInterceptor[];
  /**
   * 中间件
   */
  middlewares?: NestMiddleware[] | NestMiddlewareFn[];
  /**
   * 异常过滤器
   */
  filters?: ExceptionFilter[];
  /**
   * 管道
   */
  pipes?: PipeTransform[];
};

export type NestMiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;
