import { Injectable } from '@nestjs/common';
import { SysAuthService, SysUserService, SysCacheService } from './modules';

@Injectable()
export class SystemService {
  constructor(
    public readonly auth: SysAuthService,
    public readonly user: SysUserService,
    public readonly cache: SysCacheService,
  ) {}
}
