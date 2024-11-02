import { Global, Module } from '@nestjs/common';
import { NestCacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheKeyvService } from './cache-keyv.service';
import { KEYV } from './constants';
import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [
    NestCacheService,
    CacheKeyvService,
    {
      provide: KEYV,
      useFactory: () => {
        const keyvSqlite = new KeyvSqlite('sqlite://cache_keyv.sqlite');
        const keyv = new Keyv({
          store: keyvSqlite,
        });
        keyv.on('error', (err) => console.error('Connection Error', err));
        return keyv;
      },
    },
  ],
  exports: [NestCacheService, CacheKeyvService],
})
export class NestCacheModule {}
