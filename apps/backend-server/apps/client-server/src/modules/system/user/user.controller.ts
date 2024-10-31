import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { routePath } from '../utils';
import { BaseController } from '@app/common/core';

const prefix = routePath('users');

@Controller(prefix)
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  findList() {
    return this.userService.findList();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
