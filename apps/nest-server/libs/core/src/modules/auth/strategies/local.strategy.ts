import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

/**
 * 本地验证策略
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly options: {
      usernameField: string;
      passwordField: string;
      verifyUserFn: (data: { req: Request; username: string; password: string }) => Promise<any>;
    },
  ) {
    super({
      usernameField: options.usernameField,
      passwordField: options.passwordField,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string) {
    return await this.options.verifyUserFn({
      req,
      username,
      password,
    });
  }
}
