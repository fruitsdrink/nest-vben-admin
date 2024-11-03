import type { JwtPayladDto } from '@app/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT 验证策略
 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private accessToken: string;
  constructor(
    private readonly options: {
      secret: string;
      validateFn: (accessToken: string, payload: JwtPayladDto) => Promise<boolean>;
    },
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // 从请求头中获取 token
          let token = request.headers?.authorization?.replace('Bearer ', '');
          if (!token) {
            token = request.cookies?.Authentication;
            if (token) {
              request.headers.authorization = `Bearer ${token}`;
            }
          }
          token = token ?? '';
          this.accessToken = token;

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: options.secret,
      name: 'jwt',
    });
  }

  async validate(payload: JwtPayladDto) {
    return await this.options.validateFn(this.accessToken, payload);
  }
}
