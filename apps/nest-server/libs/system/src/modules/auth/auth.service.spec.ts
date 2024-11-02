import { Test, TestingModule } from '@nestjs/testing';
import { SysAuthService } from './auth.service';

describe('AuthService', () => {
  let service: SysAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysAuthService],
    }).compile();

    service = module.get<SysAuthService>(SysAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
