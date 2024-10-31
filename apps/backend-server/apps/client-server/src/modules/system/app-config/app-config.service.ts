import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import ms from 'ms';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 监听端口
   */
  get appPort(): number {
    return this.configService.get<number>('APP_PORT');
  }

  /**
   * 是否启用跨域
   */
  get appEnableCors(): boolean {
    return this.configService.get<boolean>('APP_ENABLE_CORS');
  }

  /**
   * 跨域来源
   */
  get appCorsOrigin(): string | string[] {
    const value = this.configService.get<string>('APP_CORS_ORIGIN');
    // 判断是否包含逗号
    if (value.includes(',')) {
      return value.split(',');
    }
    return value;
  }

  /**
   * 全局前缀
   */
  get appPrefix(): string {
    return this.configService.get<string>('APP_PREFIX');
  }

  /**
   * 是否启用版本控制
   */
  get appEnableVersion(): boolean {
    return this.configService.get<boolean>('APP_ENABLE_VERSION');
  }

  /**
   * JWT 密钥
   */
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  /**
   * JWT 过期时间
   */
  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN');
  }

  /**
   * JWT 过期时间（毫秒）
   */
  get jwtExpiresInMilliseconds(): number {
    return ms(this.jwtExpiresIn);
  }

  /**
   * JWT Cookie 是否启用安全标志
   */
  get jwtCookieSecure(): boolean {
    return this.configService.get<boolean>('JWT_COOKIE_SECURE');
  }

  /**
   * jwt 刷新密钥
   */
  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  /**
   * jwt 刷新过期时间
   */
  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
  }

  /**
   * jwt 刷新过期时间（毫秒）
   */
  get jwtRefreshExpiresInMilliseconds(): number {
    return ms(this.jwtRefreshExpiresIn);
  }

  private async getCacheValue(key: Prisma.settingsFindFirstArgs['where']['key']) {
    const cacheKey = `CACHE_SETTINGS_${key}`;
    let cacheValue = await this.cacheManager.get(cacheKey);
    if (cacheValue) {
      return cacheValue;
    }
    const config = await this.prismaService.settings.findFirst({
      where: {
        key,
        deletedAt: 0,
      },
    });

    switch (key) {
      case 'CAPTCHA_TYPE':
        if (config) {
          cacheValue = config.value === '1' ? 1 : 0;
        } else {
          cacheValue = this.configService.get<number>('CAPTCHA_TYPE');
        }
        break;
      case 'CAPTCHA_TTL':
        if (config) {
          cacheValue = config.value;
        } else {
          cacheValue = this.configService.get<string>('CAPTCHA_TTL');
        }
        break;
      case 'CAPTCHA_LENGTH':
        if (config) {
          cacheValue = parseInt(config.value);
          cacheValue = (cacheValue as number) < 4 ? 4 : cacheValue;
        } else {
          const length = this.configService.get<number>('CAPTCHA_LENGTH');
          if (length < 4) {
            cacheValue = 4;
          } else {
            cacheValue = length;
          }
        }
        break;
      case 'CAPTCHA_CASE_SENSITIVE':
        if (config) {
          cacheValue = config.value === '1' ? true : false;
        } else {
          cacheValue = this.configService.get<boolean>('CAPTCHA_CASE_SENSITIVE');
        }
        break;
      case 'REGISTER_ENABLED':
        if (config) {
          cacheValue = config.value === '1' ? true : false;
        } else {
          cacheValue = this.configService.get<boolean>('REGISTER_ENABLE');
        }
        break;
      case 'REGISTER_VERIFY':
        if (config) {
          cacheValue = config.value === '1' ? true : false;
        } else {
          cacheValue = this.configService.get<boolean>('REGISTER_VERIFY');
        }
        break;
      case 'REGISTER_CHANGE_PASSWORD':
        if (config) {
          cacheValue = config.value === '1' ? true : false;
        } else {
          cacheValue = this.configService.get<boolean>('REGISTER_CHANGE_PASSWORD');
        }
        break;
      case 'REGISTER_PASSWORD_STRENGTH':
        if (config) {
          cacheValue = parseInt(config.value);
        } else {
          cacheValue = this.configService.get<number>('REGISTER_PASSWORD_STRENGTH');
        }
        break;
    }

    await this.cacheManager.set(cacheKey, cacheValue);
    return cacheValue;
  }

  /**
   * 验证码类型
   * 0 无验证码 1 图片验证码
   */
  async captchaType(): Promise<number> {
    return (await this.getCacheValue('CAPTCHA_TYPE')) as number;
  }

  /**
   * 验证码有效时间
   */
  async captchaTTL(): Promise<string> {
    return (await this.getCacheValue('CAPTCHA_TTL')) as string;
  }

  /**
   * 验证码有效时间（毫秒）
   */
  async captchaTTLMilliseconds(): Promise<number> {
    const value = await this.captchaTTL();
    return ms(value);
  }

  /**
   * 验证码长度,最小为 4
   * captchaType === 1 时生效
   */
  async captchaLength(): Promise<number> {
    return (await this.getCacheValue('CAPTCHA_LENGTH')) as number;
  }

  /**
   * 验证码是否区分大小写
   */
  async captchaCaseSensitive(): Promise<boolean> {
    return (await this.getCacheValue('CAPTCHA_CASE_SENSITIVE')) as boolean;
  }

  /**
   * 是否启用注册用户
   */
  async registerEnable(): Promise<boolean> {
    return (await this.getCacheValue('REGISTER_ENABLED')) as boolean;
  }

  /**
   * 注册用户是否需要验证
   */
  async registerVerify(): Promise<boolean> {
    return (await this.getCacheValue('REGISTER_VERIFY')) as boolean;
  }

  /**
   * 注册用户是否需要修改默认密码
   */
  async registerChangePassword(): Promise<boolean> {
    return (await this.getCacheValue('REGISTER_CHANGE_PASSWORD')) as boolean;
  }

  /**
   * 注册用户密码强度
   * 0 无要求 1 弱 2 中 3 强 4 极强
   */
  async registerPasswordStrength(): Promise<number> {
    return (await this.getCacheValue('REGISTER_PASSWORD_STRENGTH')) as number;
  }
}
