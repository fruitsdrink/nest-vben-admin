import { SystemService } from '@app/system';
import { Injectable } from '@nestjs/common';
import type { SysUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private systemService: SystemService) {}

  getInfo(user: SysUser) {
    const { id, realName, username } = user;

    return {
      id,
      realName,
      username,
      roles: [],
    };
  }
}
