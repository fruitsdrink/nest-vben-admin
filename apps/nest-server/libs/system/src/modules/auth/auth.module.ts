import { SysCacheService } from './../cache/cache.service';
import { Module, UnauthorizedException, DynamicModule, BadRequestException } from '@nestjs/common';
import { SysAuthService } from './auth.service';
import { NestAuthModule, PrismaService, LocalVerifyUserFnOptions } from '@app/core';
import { compare, type JwtPayladDto } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [SysAuthService],
  exports: [SysAuthService],
})
export class SysAuthModule {
  static register(): DynamicModule {
    return {
      module: SysAuthModule,
      imports: [
        JwtModule,
        NestAuthModule.registerAsync({
          useFactory: (prismaService: PrismaService, sysCache: SysCacheService) => {
            // 清除auth缓存
            const clearAuthCache = async (userId: string) => {
              await Promise.all([
                sysCache.auth.del(userId),
                sysCache.user.del(userId),
                prismaService.sysUser.update({
                  where: {
                    id: userId,
                  },
                  data: {
                    accessToken: null,
                    refreshToken: null,
                  },
                }),
              ]);
            };

            return {
              jwt: {
                validateFn: async (accessToken: string, payload: JwtPayladDto) => {
                  const user = await prismaService.sysUser.findFirst({
                    where: {
                      id: payload.userId,
                      status: 1,
                      isVerify: 1,
                    },
                  });
                  if (!user) {
                    await clearAuthCache(payload.userId);
                    throw new UnauthorizedException('用户不存在或已被禁用');
                  }
                  // 从缓存中获取accessToken
                  let cacheAccessToken = await sysCache.auth.get(user.id);

                  if (cacheAccessToken) {
                    if (cacheAccessToken !== accessToken) {
                      await clearAuthCache(user.id);

                      throw new UnauthorizedException('用户已退出登录');
                    }
                  } else {
                    cacheAccessToken = user.accessToken;
                    await sysCache.auth.set(user.id, cacheAccessToken);
                  }

                  if (cacheAccessToken !== accessToken) {
                    await clearAuthCache(user.id);
                    throw new UnauthorizedException('用户已退出登录');
                  }

                  return user;
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

                  // 缓存用户信息
                  await sysCache.user.set(user.id, user);

                  return user;
                },
              },
            };
          },
          inject: [PrismaService, SysCacheService],
        }),
      ],
      exports: [JwtModule],
    };
  }
}
