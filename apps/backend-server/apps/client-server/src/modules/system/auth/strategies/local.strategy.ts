import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * 本地验证策略
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string) {
    const { captchaId, captchaText } = req.body as any;

    return await this.authService.verifyUser({
      username,
      password,
      captchaId,
      captchaText,
    });
  }
}
