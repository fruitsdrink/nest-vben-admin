import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SystemModule } from '@app/system';

/**
 * 系统用户模块
 */
@Module({
  imports: [SystemModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
