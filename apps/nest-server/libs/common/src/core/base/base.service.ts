import type { AppConfigService } from '@app/core';
import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * 服务基类
 */
export class BaseService {
  /**
   * 将普通对象转换为实例对象
   * @param cls 目标类
   * @param source 源数据
   * @returns
   */
  protected plainToInstance<T, V>(cls: ClassConstructor<T>, source: V) {
    return plainToInstance(cls, source);
  }

  protected avatarUrl(appConfig: AppConfigService, avatar: string) {
    // 如果avatar的第一个字符是/，则删除第一个字符
    if (avatar.startsWith('/')) {
      avatar = avatar.substring(1);
    }
    console.log(avatar);
    console.log(appConfig.publicPath);
    return `${appConfig.host}${appConfig.publicPath}/${avatar}`;
  }
}
