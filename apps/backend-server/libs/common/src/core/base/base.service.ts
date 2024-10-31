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
}
