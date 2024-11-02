import type { JwtPayladDto } from '@app/common';
import { Request } from 'express';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

export interface LocalVerifyUserFnOptions {
  req: Request;
  username: string;
  password: string;
}
export interface NestAuthModuleOptions {
  jwt: {
    validateFn: (accessToken: string, payload: JwtPayladDto) => Promise<any>;
  };
  local: {
    usernameField: string;
    passwordField: string;
    verifyUserFn: (data: LocalVerifyUserFnOptions) => Promise<any>;
  };
}

export interface NestAuthModuleOptionsFactory {
  createNestAuthModuleOptions(): Promise<NestAuthModuleOptions> | NestAuthModuleOptions;
}

export interface NestAuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<NestAuthModuleOptions> | NestAuthModuleOptions;
  inject?: any[];
  useClass?: Type<NestAuthModuleOptionsFactory>;
}
