import { Test, TestingModule } from '@nestjs/testing';
import { CacheKeyvService } from './cache-keyv.service';

describe('CacheKeyvService', () => {
  let service: CacheKeyvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheKeyvService],
    }).compile();

    service = module.get<CacheKeyvService>(CacheKeyvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
