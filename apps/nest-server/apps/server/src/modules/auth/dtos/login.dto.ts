import { Allow, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Allow()
  captcha?: boolean;
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
