import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '@app/common/decorators';
import { routePath } from '../utils';
import { RegisterRequestDto } from './dtos';
import { User } from '@prisma/client';

const prefix = routePath('auth');

@Controller(prefix)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: { id: string }, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(user, response);
  }

  /**
   * 刷新令牌
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  /**
   * 获取验证码类型
   */
  @Get('captcha/type')
  @Public()
  async getCaptchaType() {
    return await this.authService.getCaptchaType();
  }

  /**
   * 获取验证码
   */
  @Get('captcha')
  @Public()
  async captcha() {
    return await this.authService.createCatpcha();
  }

  /**
   * 是否启用注册
   */
  @Get('register/enabled')
  @Public()
  async registerEnabled() {
    return await this.authService.registerEnabled();
  }

  @Post('register')
  @Public()
  async regisger(@Body() data: RegisterRequestDto) {
    return await this.authService.register(data);
  }

  @Get('userinfo')
  async userInfo(@CurrentUser() user: User) {
    const { id, name, username, sex, avatar } = user;
    return {
      id,
      name,
      username,
      sex,
      avatar,
    };
  }

  /**
   * 测试
   */
  @Get('test')
  @Public()
  test() {
    return {
      isok: true,
    };
  }
}
