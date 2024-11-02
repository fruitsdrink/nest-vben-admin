import { SystemService } from '@app/system';
import { Injectable } from '@nestjs/common';
import type { SysUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private systemService: SystemService) {}

  async getInfo(user: SysUser) {
    const { id } = user;
    let cacheUser = await this.systemService.cache.user.get(id);
    if (!cacheUser) {
      this.systemService.cache.user.set(id, user);
      cacheUser = user;
    }

    const { realName, username } = cacheUser;
    return {
      id,
      realName,
      username,
      roles: [],
    };
  }
}
