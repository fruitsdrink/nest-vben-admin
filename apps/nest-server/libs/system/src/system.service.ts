import { Injectable } from '@nestjs/common';
import { SysAuthService } from './modules';

@Injectable()
export class SystemService {
  constructor(public readonly authService: SysAuthService) {}
}
