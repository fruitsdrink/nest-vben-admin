import { CacheKeyvService } from '@app/core';

/**
 * 权限认证缓存服务
 */
export class AuthCache {
  constructor(private readonly cacheKeyv: CacheKeyvService) {}

  private readonly prefix = 'auth:';
  private readonly accessTokenPrefix = `${this.prefix}accessToken:`;

  /**
   * 获取缓存键名
   * @param userId 用户ID
   * @returns
   */
  private getKey(userId: string) {
    return this.accessTokenPrefix + userId;
  }
  /**
   * 获取accessToken
   * @returns
   */
  async get(userId: string) {
    const key = this.getKey(userId);
    return await this.cacheKeyv.get<string>(key);
  }

  /**
   * 设置accessToken
   * @param userId 用户ID
   * @param accessToken jwt令牌
   * @param ttl 过期时间，单位毫秒
   * @returns
   */
  async set(userId: string, accessToken: string, ttl?: number) {
    const key = this.getKey(userId);
    return await this.cacheKeyv.set(key, accessToken, ttl);
  }

  /**
   * 删除accessToken
   * @returns
   */
  async del(userId: string) {
    const key = this.getKey(userId);
    return await this.cacheKeyv.delete(key);
  }
}
