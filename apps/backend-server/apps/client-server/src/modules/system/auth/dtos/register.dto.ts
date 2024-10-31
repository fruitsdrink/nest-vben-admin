import { IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;
  @IsNotEmpty({ message: '登录帐号不能为空' })
  username: string;
  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string;
}
