import { CacheKeyvService } from '@app/core';
import { SysUser } from '@prisma/client';

export class UserCache {
  constructor(private readonly cache: CacheKeyvService) {}

  private readonly prefix = 'user:';

  private getKey(userId: string) {
    return this.prefix + userId;
  }

  async get(userId: string): Promise<SysUser> {
    const key = this.getKey(userId);
    return await this.cache.get<SysUser>(key);
  }

  async set(userId: string, user: SysUser, ttl?: number): Promise<boolean> {
    const key = this.getKey(userId);
    return await this.cache.set(key, user, ttl);
  }

  async del(userId: string): Promise<boolean> {
    const key = this.getKey(userId);
    return await this.cache.delete(key);
  }

  async clear(): Promise<void> {
    await this.cache.clearByPrefix(this.prefix);
  }
}
