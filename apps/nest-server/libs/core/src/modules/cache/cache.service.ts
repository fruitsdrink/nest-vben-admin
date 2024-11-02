import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class NestCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
}
