import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * 控制器基类
 */
export class BaseController {
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
