import { Inject, Injectable } from '@nestjs/common';
import { KEYV } from './constants';
import { Keyv } from 'keyv';

@Injectable()
export class CacheKeyvService {
  constructor(@Inject(KEYV) private readonly keyv: Keyv) {}

  /**
   * 获取缓存
   * @param key 缓存键名
   * @returns
   */
  async get<T>(key: string): Promise<T> {
    return await this.keyv.get<T>(key);
  }

  /**
   * 设置缓存
   * @param key 缓存键名
   * @param value 缓存值
   * @param ttl 过期时间，单位毫秒
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return await this.keyv.set(key, value, ttl);
  }

  /**
   * 删除缓存
   * @param key 缓存键名
   */
  async delete(key: string): Promise<boolean> {
    return await this.keyv.delete(key);
  }

  /**
   * 清空缓存
   */
  async clear(): Promise<void> {
    await this.keyv.clear();
  }

  /**
   * 清空指定前缀的缓存
   * @returns
   */
  async clearByPrefix(prefix: string): Promise<void> {
    for await (const [key, value] of this.keyv.iterator('all')) {
      if (key.startsWith(prefix)) {
        await this.keyv.delete(key);
      }
    }
  }

  /**
   * 判断缓存是否存在
   * @param key 缓存键名
   * @returns
   */
  async has(key: string): Promise<boolean> {
    return await this.keyv.has(key);
  }
}
