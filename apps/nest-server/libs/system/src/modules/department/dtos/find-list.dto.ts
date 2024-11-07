/**
 * 分页查询部门列表参数
 */
export interface FindListDto {
  keyword?: string;
  status?: '0' | '1';
}
