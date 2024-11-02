import { CacheKeyvService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { AuthCache, UserCache } from './caches';

/**
 * 系统缓存服务
 */
@Injectable()
export class SysCacheService {
  public auth: AuthCache;
  public user: UserCache;
  constructor(private readonly cacheKeyv: CacheKeyvService) {
    this.auth = new AuthCache(cacheKeyv);
    this.user = new UserCache(cacheKeyv);
  }
}
