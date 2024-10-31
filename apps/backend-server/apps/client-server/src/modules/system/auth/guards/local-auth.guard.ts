import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 本地验证守卫
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
