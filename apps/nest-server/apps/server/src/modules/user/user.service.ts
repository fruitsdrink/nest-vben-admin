import { BaseService } from '@app/common';
import { AppConfigService } from '@app/core';
import { SystemService } from '@app/system';
import { Injectable } from '@nestjs/common';
import { SysUser } from '@prisma/client';

@Injectable()
export class UserService extends BaseService {
  constructor(private systemService: SystemService, private readonly appConfig: AppConfigService) {
    super();
  }

  async getInfo(user: SysUser) {
    const { id } = user;

    let cacheUser = await this.systemService.cache.user.get(id);

    if (!cacheUser) {
      this.systemService.cache.user.set(id, user);
      cacheUser = user;
    }

    const { realName, username, avatar } = cacheUser;
    return {
      id,
      realName,
      username,
      roles: [],
      avatar: avatar ? this.avatarUrl(this.appConfig, avatar) : null,
    };
  }
}
