import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from '../interfaces';
import { AuthService } from '../auth.service';
import { AppConfigService } from '../../app-config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(AppConfigService)
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false, // 是否忽略过期时间
      secretOrKey: appConfigService.jwtRefreshSecret,
      passReqToCallback: true, // 传递请求对象到回调函数中
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    return await this.authService.verifyUserRefreshToken(payload.userId, request.cookies?.Refresh);
  }
}
