import { Allow, IsNotEmpty } from 'class-validator';

/**
 * 用户名密码登录请求 DTO
 */
export class UserLoginRequestDto {
  @IsNotEmpty({ message: '登录帐号不能为空' })
  username: string;
  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string;
  @Allow()
  captchaId?: string;
  @Allow()
  captchaText?: string;
}
