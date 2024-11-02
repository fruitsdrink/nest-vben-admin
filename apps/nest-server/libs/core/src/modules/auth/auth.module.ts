import { Module, type DynamicModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import type { NestAuthModuleAsyncOptions, NestAuthModuleOptions } from './types';
import { createNestAuthAsyncProviders, createNestAuthProvider } from './auth.providers';

/**
 * 认证授权模块
 */
@Module({})
export class NestAuthModule {
  static register(options: NestAuthModuleOptions) {
    const providers = createNestAuthProvider(options);

    return {
      module: NestAuthModule,
      imports: [PassportModule, JwtModule],
      providers,
      exports: [PassportModule, JwtModule],
    };
  }
  static registerAsync(options: NestAuthModuleAsyncOptions): DynamicModule {
    const providers = createNestAuthAsyncProviders(options);

    return {
      module: NestAuthModule,
      imports: [PassportModule, JwtModule, ...(options.imports || [])],
      providers,
      exports: [PassportModule, JwtModule],
    } as DynamicModule;
  }
}
