import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from '@app/common';

/**
 * 用户模块
 */
@Module({
  imports: [CommonModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
