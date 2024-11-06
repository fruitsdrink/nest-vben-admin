import { Allow, IsNotEmpty } from 'class-validator';

/**
 * 登录请求参数
 */
export class LoginDto {
  /**
   * 是否已验证
   */
  @Allow()
  captcha?: boolean;
  /**
   * 用户吗
   */
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  /**
   * 密码
   */
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  /**
   * 访问令牌
   */
  accessToken: string;
  /**
   * 用户ID
   */
  id: string;
  /**
   * 真实姓名
   */
  realName: string;
  /**
   * 角色
   */
  roles: string[];
  /**
   * 用户名
   */
  username: string;
  /**
   * 头像
   */
  avatar?: string;
}
