export interface Delete<R> {
  /**
   * 删除
   * @param id ID
   * @param userId 用户ID
   */
  delete(id: string, userId: string): Promise<R>;
}
