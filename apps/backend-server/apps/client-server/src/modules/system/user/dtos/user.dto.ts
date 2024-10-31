import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  username: string;
  @Exclude()
  password: string;
  status: number;
  remark?: string;
}
