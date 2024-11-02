/**
 * 查询多个数据服务接口
 * @template TQuery 查询条件类型
 * @template TResult 查询结果类型
 */
export interface FindManyService<TQuery, TResult> {
  /**
   * 查询多个
   * @param query 查询条件
   */
  findMany(query: TQuery): Promise<TResult[]>;
}
