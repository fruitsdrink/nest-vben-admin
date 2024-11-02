import { BadRequestException, Module, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NestAuthModule, PrismaService } from '@app/core';
import { compare, type JwtPayladDto } from '@app/common';
import type { LocalVerifyUserFnOptions } from '@app/core/modules/auth/types';
import { SystemModule } from '@app/system';

@Module({
  imports: [
    SystemModule,
    NestAuthModule.registerAsync({
      useFactory: (prismaService: PrismaService) => {
        return {
          jwt: {
            validateFn: async (payload: JwtPayladDto) => {
              try {
                const user = await prismaService.sysUser.findById(payload.userId);

                if (!user || !user.status) {
                  throw new UnauthorizedException();
                }
                return user;
              } catch (error) {
                throw new UnauthorizedException();
              }
            },
          },
          local: {
            usernameField: 'username',
            passwordField: 'password',
            verifyUserFn: async (data: LocalVerifyUserFnOptions) => {
              const { req, username, password } = data;
              const { captcha } = req.body as any;
              if (!captcha) {
                throw new BadRequestException('请先完成验证');
              }

              const user = await prismaService.sysUser.findFirst({
                where: {
                  username,
                  isVerify: 1,
                  status: 1,
                },
              });

              if (!user) {
                throw new BadRequestException('用户名或或密码错误');
              }

              if (!compare(password, user.password)) {
                throw new BadRequestException('用户名或或密码错误');
              }

              return user;
            },
          },
        };
      },
      inject: [PrismaService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
