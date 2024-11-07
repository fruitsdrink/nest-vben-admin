/**
 * 查询多个部门
 */
export interface FindManyDto {
  keyword?: string;
  status?: '0' | '1';
}
