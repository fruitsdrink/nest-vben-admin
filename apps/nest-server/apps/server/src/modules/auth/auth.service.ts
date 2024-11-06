import { AppConfigService, PrismaService } from '@app/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { SysUser } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SystemService } from '@app/system';
import type { LoginResult, RefreshDto } from './dtos';
import { BaseService } from '@app/common';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly primsa: PrismaService,
    private readonly appConfig: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly systemService: SystemService,
  ) {
    super();
  }

  /**
   * 获取jwt令牌
   * @param user 当前用户
   * @param response 当前请求的响应
   * @returns jwt令牌
   */
  async login(user: SysUser, response: Response): Promise<LoginResult> {
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn, cookieSecure } =
      this.genenateToken(user);

    // 将令牌存储到数据库
    await this.primsa.sysUser.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.cookie('Authentication', accessToken, {
      expires: expiresIn,
      secure: cookieSecure,
      httpOnly: true,
    });

    response.cookie('Refresh', refreshToken, {
      expires: refreshExpiresIn,
      secure: cookieSecure,
      httpOnly: true,
    });

    return {
      accessToken,
      id: user.id,
      realName: user.realName,
      roles: [],
      username: user.username,
      avatar: user.avatar ? this.avatarUrl(this.appConfig, user.avatar) : null,
    };
  }

  /**
   * 生成jwt令牌
   * @param user 当前用户
   * @returns jwt令牌
   */
  private genenateToken(user: SysUser) {
    return this.systemService.auth.genenateToken(this.jwtService, {
      userId: user.id,
      jwt: {
        secret: this.appConfig.jwt.secret,
        expiresIn: this.appConfig.jwt.expiresIn,
        expiresInMilliseconds: this.appConfig.jwt.expiresInMilliseconds,
        refreshSecret: this.appConfig.jwt.refreshSecret,
        refreshExpiresIn: this.appConfig.jwt.refreshExpiresIn,
        refreshExpiresInMilliseconds: this.appConfig.jwt.refreshExpiresInMilliseconds,
        cookieSecure: this.appConfig.jwt.cookieSecure,
      },
    });
  }

  /**
   * 刷新令牌
   * @param user 当前用户
   * @param res 当前请求的响应
   * @param data 刷新令牌数据
   */
  async refreshToken(user: SysUser, res: Response, data: RefreshDto) {
    if (!data.withCredentials) {
      throw new UnauthorizedException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    const { accessToken } = await this.login(user, res);
    return {
      accessToken,
      status: 1,
    };
  }

  /**
   * 获取当前用户的权限码
   * @param userId 用户id
   */
  getCodes(uesrId: string) {
    //todo 获取用户权限码
    return ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'];
  }

  /**
   * 用户登出
   * @param userId 用户id
   */
  async logout(userId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    await Promise.all([
      this.primsa.sysUser.update({
        where: {
          id: userId,
        },
        data: {
          accessToken: null,
          refreshToken: null,
        },
      }),
      this.systemService.cache.auth.del(userId),
      this.systemService.cache.user.del(userId),
    ]);
  }
}
