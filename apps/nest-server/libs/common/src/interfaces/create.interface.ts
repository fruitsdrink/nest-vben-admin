export interface Create<T, R> {
  /**
   * 创建
   * @param data 数据
   * @param userId 用户ID
   */
  create(data: T, userId: string): Promise<R>;
}
