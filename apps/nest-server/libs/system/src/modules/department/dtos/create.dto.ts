import { Allow, IsNotEmpty } from 'class-validator';

/**
 * 创建部门数据传输对象
 */
export class CreateDto {
  /**
   * 名称
   */
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;
  /**
   * 部门领导
   */
  @Allow()
  leader?: string;
  /**
   * 电话
   */
  @Allow()
  phone?: string;
  /**
   * 邮箱
   */
  @Allow()
  email?: string;
  /**
   * 父级 ID
   */
  @Allow()
  parentId?: string;
  /**
   * 排序\
   */
  @Allow()
  sortNo?: number;
  /**
   * 备注
   */
  @Allow()
  remark?: string;
  /**
   * 状态
   */
  @Allow()
  status?: number;
}
