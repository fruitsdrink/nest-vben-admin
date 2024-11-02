import { AppConfigService, PrismaService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SysUser } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SystemService } from '@app/system';
import type { LoginResult } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaSErvice: PrismaService,
    private readonly appConfig: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly systemService: SystemService,
  ) {}

  async login(user: SysUser, response: Response): Promise<LoginResult> {
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn, cookieSecure } =
      this.genenateToken(user);

    // 将令牌存储到数据库
    await this.prismaSErvice.sysUser.update({
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
    };
  }

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
}
