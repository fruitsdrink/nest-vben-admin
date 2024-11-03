import { BaseService, type JwtPayladDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { GenerateTokenOptions, GenerateTokenResult } from './types';
import { SysCacheService } from '../cache';
import type { PrismaService } from '@app/core';

@Injectable()
export class SysAuthService extends BaseService {
  constructor(private readonly cache: SysCacheService) {
    super();
  }
  /**
   * 生成token
   * @param jwtService Jwt服务
   * @param options 生成token的选项
   * @returns
   */
  public genenateToken(jwtService: JwtService, options: GenerateTokenOptions): GenerateTokenResult {
    // jwt 过期时间
    const expiresIn = new Date();
    expiresIn.setMilliseconds(expiresIn.getTime() + options.jwt.expiresInMilliseconds);

    // jwt 刷新过期时间
    const refreshExpiresIn = new Date();
    refreshExpiresIn.setMilliseconds(
      refreshExpiresIn.getTime() + options.jwt.refreshExpiresInMilliseconds,
    );

    const payload: JwtPayladDto = {
      userId: options.userId,
    };

    // 生成 jwt 令牌
    const accessToken = jwtService.sign(payload, {
      secret: options.jwt.secret,
      expiresIn: options.jwt.expiresIn,
    });

    // 生成 jwt 刷新令牌
    const refreshToken = jwtService.sign(payload, {
      secret: options.jwt.refreshSecret,
      expiresIn: options.jwt.refreshExpiresIn,
    });

    // 缓存 accessToken
    this.cache.auth.set(options.userId, accessToken, options.jwt.expiresInMilliseconds);

    return {
      accessToken,
      expiresIn,
      refreshToken,
      refreshExpiresIn,
      cookieSecure: options.jwt.cookieSecure,
    };
  }
}
