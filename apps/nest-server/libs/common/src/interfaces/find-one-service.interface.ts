/**
 * 查询单个数据服务接口
 * @template TResult 数据类型
 */
export interface FindOneService<TResult> {
  /**
   * 根据 ID 查询
   * @param id ID
   */
  findOne(id: string): Promise<TResult>;
}
