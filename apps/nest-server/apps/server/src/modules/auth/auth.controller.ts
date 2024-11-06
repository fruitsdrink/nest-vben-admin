import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CurrentUser, Public } from '@app/common';
import { SysUser } from '@prisma/client';

import { Response } from 'express';
import { LocalAuthGuard } from '@app/core';
import type { RefreshDto } from './dtos';

/**
 * 权限认证控制器
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  /**
   * 用户登录
   * @param user 当前登录用户
   * @param response
   * @returns 返回jwt令牌
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: SysUser, @Res({ passthrough: true }) response: Response) {
    return await this.service.login(user, response);
  }

  /**
   * 获取当前用户的权限码
   * @param user 当前用户
   * @returns 返回权限码
   */
  @Get('codes')
  async codes(@CurrentUser() user: SysUser) {
    return await this.service.getCodes(user.id);
  }

  /**
   * 刷新令牌
   * @param data 刷新令牌数据
   * @returns
   */
  @Post('refresh')
  async refreshToken(
    @Body() data: RefreshDto,
    @CurrentUser() user: SysUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.service.refreshToken(user, response, data);
  }

  /**
   * 用户登出
   * @param user 当前用户
   * @returns
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: SysUser) {
    return await this.service.logout(user.id);
  }

  @Get('test')
  @Public()
  async test() {
    return {
      isok: true,
    };
  }
}
