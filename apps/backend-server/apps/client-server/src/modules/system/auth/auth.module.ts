import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@app/client-server/modules/system/user';
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards';
import { CommonModule } from '@app/common';

/**
 * 身份验证模块
 */
@Module({
  imports: [UserModule, PassportModule, JwtModule, CommonModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
