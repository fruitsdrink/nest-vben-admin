import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

/**
 * 应用配置服务
 */
@Injectable()
export class AppConfigService {
  private _host: string; // 主机
  private _apiUrl: string; // 接口地址
  private _publicPath: string; // 静态资源地址

  constructor(private readonly configService: ConfigService) {}

  get host() {
    return this._host;
  }

  set host(value: string) {
    this._host = value;
  }
  get apiUrl() {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
  }

  get publicPath() {
    return this._publicPath;
  }

  set publicPath(value: string) {
    this._publicPath = value;
  }

  private appConfig() {
    /**
     * 环境
     */
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    /**
     * 端口
     */
    const port = this.configService.get<number>('APP_PORT');
    /**
     * 前缀
     */
    const prefix = this.configService.get<string>('APP_PREFIX');
    /**
     * 是否启用版本
     */
    const enableVersion = this.configService.get<boolean>('APP_ENABLE_VERSION');
    /**
     * 是否启用跨域
     */
    const enableCors = this.configService.get<boolean>('APP_ENABLE_CORS');
    /**
     * 跨域来源
     */
    const corsOrigin = this.configService.get<string | null>('APP_CORS_ORIGIN');
    /**
     * 跨域凭证
     */
    const corsCredentials = this.configService.get<boolean>('APP_CORS_CREDENTIALS');

    return {
      nodeEnv,
      port,
      enableCors,
      corsOrigin,
      prefix,
      enableVersion,
      corsCredentials,
    };
  }

  /**
   * JWT 配置
   */
  private jwtConfig() {
    /**
     * 密钥
     */
    const secret = this.configService.get<string>('JWT_SECRET');
    /**
     * 过期时间
     */
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    /**
     * 刷新过期时间
     */
    const cookieSecure = this.configService.get<boolean>('JWT_COOKIE_SECURE');
    /**
     * 刷新密钥
     */
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    /**
     * 刷新过期时间
     */
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

    /**
     * 过期时间毫秒
     */
    const expiresInMilliseconds = ms(expiresIn);
    /**
     * 刷新过期时间毫秒
     */
    const refreshExpiresInMilliseconds = ms(refreshExpiresIn);

    return {
      secret,
      expiresIn,
      cookieSecure,
      refreshSecret,
      refreshExpiresIn,
      expiresInMilliseconds,
      refreshExpiresInMilliseconds,
    };
  }

  /**
   * Redis 配置
   * @returns
   */
  private redisConfig() {
    /**
     * 主机
     */
    const host = this.configService.get<string>('REDIS_HOST');
    /**
     * 端口
     */
    const port = this.configService.get<number>('REDIS_PORT');
    /**
     * 密码
     */
    const password = this.configService.get<string>('REDIS_PASSWORD');
    /**
     * 数据库
     */
    const db = this.configService.get<number>('REDIS_DB');
    /**
     * 键前缀
     */
    const keyPrefix = this.configService.get<string>('REDIS_KEY_PREFIX');

    return {
      host,
      port,
      password,
      db,
      keyPrefix,
    };
  }

  /**
   * 应用配置
   */
  get app(): ReturnType<AppConfigService['appConfig']> {
    return this.appConfig();
  }

  /**
   * JWT 配置
   */
  get jwt(): ReturnType<AppConfigService['jwtConfig']> {
    return this.jwtConfig();
  }

  get redis(): ReturnType<AppConfigService['redisConfig']> {
    return this.redisConfig();
  }
}
