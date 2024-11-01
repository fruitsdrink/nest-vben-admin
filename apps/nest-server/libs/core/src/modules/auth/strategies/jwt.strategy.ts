import type { JwtPayladDto } from '@app/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT 验证策略
 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly options: {
      secret: string;
      validateFn: (payload: JwtPayladDto) => Promise<boolean>;
    },
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // 从请求头中获取 token
          const token = request.headers?.authorization?.replace('Bearer ', '');
          if (!token) {
            return request.cookies?.Authentication;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: options.secret,
      name: 'jwt',
    });
  }

  async validate(payload: JwtPayladDto) {
    return await this.options.validateFn(payload);
  }
}
