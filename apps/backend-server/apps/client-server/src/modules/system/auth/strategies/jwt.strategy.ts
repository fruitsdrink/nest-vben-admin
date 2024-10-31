import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { AppConfigService } from '../../app-config';

/**
 * JWT 验证策略
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AppConfigService)
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
    });
  }

  async validate(payload: TokenPayload) {
    return await this.authService.verfiyUserToken(payload);
  }
}
