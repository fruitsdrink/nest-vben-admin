import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { LocalStrategy } from '../strategies';

/**
 * 本地验证守卫
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
