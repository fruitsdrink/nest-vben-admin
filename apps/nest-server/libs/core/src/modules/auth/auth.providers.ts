import { APP_GUARD } from '@nestjs/core';
import { AppConfigService } from '../app-config';
import { JwtAuthGuard } from './guards';
import { JwtStrategy, LocalStrategy } from './strategies';
import type {
  NestAuthModuleAsyncOptions,
  NestAuthModuleOptions,
  NestAuthModuleOptionsFactory,
} from './types';
import type { Provider, Type } from '@nestjs/common';
import { NESTAUTH_MODULE_OPTIONS } from './auth.constants';

export const createNestAuthProvider = (options: NestAuthModuleOptions): Provider[] => {
  return [
    {
      provide: JwtStrategy,
      useFactory: (appConfig: AppConfigService) => {
        return new JwtStrategy({
          secret: appConfig.jwt.secret,
          validateFn: options.jwt.validateFn,
        });
      },
      inject: [AppConfigService],
    },
    {
      provide: LocalStrategy,
      useFactory: () => {
        return new LocalStrategy({
          usernameField: options.local.usernameField,
          passwordField: options.local.passwordField,
          verifyUserFn: options.local.verifyUserFn,
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ];
};

export const createNestAuthAsyncProviders = (options: NestAuthModuleAsyncOptions): Provider[] => {
  const providers: Provider[] = [];

  if (options.useClass) {
    const useClass = options.useClass as Type<NestAuthModuleOptionsFactory>;
    providers.push(
      ...[
        {
          provide: NESTAUTH_MODULE_OPTIONS,
          useFactory: async (optionsFactory: NestAuthModuleOptionsFactory) =>
            await optionsFactory.createNestAuthModuleOptions(),
          inject: [useClass],
        },
        {
          provide: useClass,
          useClass,
        },
      ],
    );
  }

  if (options.useFactory) {
    providers.push({
      provide: NESTAUTH_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    });
  }
  providers.push({
    provide: JwtStrategy,
    useFactory: (appConfig: AppConfigService, options: NestAuthModuleOptions) => {
      return new JwtStrategy({
        secret: appConfig.jwt.secret,
        validateFn: options.jwt.validateFn,
      });
    },
    inject: [AppConfigService, NESTAUTH_MODULE_OPTIONS],
  });

  providers.push({
    provide: LocalStrategy,
    useFactory: (options: NestAuthModuleOptions) => {
      return new LocalStrategy({
        usernameField: options.local.usernameField,
        passwordField: options.local.passwordField,
        verifyUserFn: options.local.verifyUserFn,
      });
    },
    inject: [NESTAUTH_MODULE_OPTIONS],
  });

  providers.push({
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  });

  return providers;
};
