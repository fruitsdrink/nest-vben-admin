export interface Update<T, R> {
  /**
   * 更新
   * @param id ID
   * @param data 数据
   * @param userId 用户ID
   */
  update(id: string, data: T, userId: string): Promise<R>;
}
