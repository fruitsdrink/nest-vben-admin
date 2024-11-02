import { Injectable } from '@nestjs/common';
import { SysAuthService, SysUserService } from './modules';

@Injectable()
export class SystemService {
  constructor(
    public readonly authService: SysAuthService,
    public readonly userService: SysUserService,
  ) {}
}
