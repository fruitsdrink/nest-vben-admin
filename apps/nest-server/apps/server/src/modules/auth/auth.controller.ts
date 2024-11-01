import { Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CurrentUser, Public } from '@app/common';
import { SysUser } from '@prisma/client';

import { Response } from 'express';
import { LocalAuthGuard } from '@app/core';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: SysUser, @Res({ passthrough: true }) response: Response) {
    return await this.service.login(user, response);
  }

  @Get('test')
  @Public()
  async test() {
    return 'hello test';
  }
}
