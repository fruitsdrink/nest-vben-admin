import { AppConfigService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SysUser } from '@prisma/client';
import type { JwtPayladDto } from '@app/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: SysUser, response: Response) {
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn, cookieSecure } =
      this.genenateToken(user);

    response.cookie('Authentication', accessToken, {
      expires: expiresIn,
      secure: cookieSecure,
      httpOnly: true,
    });

    response.cookie('RefreshAuthentication', refreshToken, {
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
    // jwt 过期时间
    const expiresIn = new Date();
    expiresIn.setMilliseconds(expiresIn.getTime() + this.appConfig.jwt.expiresInMilliseconds);

    // jwt 刷新过期时间
    const refreshExpiresIn = new Date();
    refreshExpiresIn.setMilliseconds(
      refreshExpiresIn.getTime() + this.appConfig.jwt.refreshExpiresInMilliseconds,
    );

    const payload: JwtPayladDto = {
      userId: user.id,
    };

    // 生成 jwt 令牌
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfig.jwt.secret,
      expiresIn: this.appConfig.jwt.expiresIn,
    });

    // 生成 jwt 刷新令牌
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfig.jwt.refreshSecret,
      expiresIn: this.appConfig.jwt.refreshExpiresIn,
    });

    return {
      accessToken,
      expiresIn,
      refreshToken,
      refreshExpiresIn,
      cookieSecure: this.appConfig.jwt.cookieSecure,
    };
  }
}
