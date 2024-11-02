import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '@app/common';
import type { SysUser } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('info')
  async getInfo(@CurrentUser() user: SysUser) {
    return this.service.getInfo(user);
  }
}
