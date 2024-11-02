import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SysAuthModule, SystemModule } from '@app/system';

@Module({
  imports: [SystemModule, SysAuthModule.register()],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
