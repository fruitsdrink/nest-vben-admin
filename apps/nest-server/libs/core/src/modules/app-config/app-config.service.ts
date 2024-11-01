import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 应用配置服务
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  private appConfig() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const port = this.configService.get<number>('APP_PORT');
    const prefix = this.configService.get<string>('APP_PREFIX');
    const enableVersion = this.configService.get<boolean>('APP_ENABLE_VERSION');
    const enableCors = this.configService.get<boolean>('APP_ENABLE_CORS');
    const corsOrigin = this.configService.get<string | null>('APP_CORS_ORIGIN');
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
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const cookieSecure = this.configService.get<boolean>('JWT_COOKIE_SECURE');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    return {
      secret,
      expiresIn,
      cookieSecure,
      refreshSecret,
      refreshExpiresIn,
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
}
