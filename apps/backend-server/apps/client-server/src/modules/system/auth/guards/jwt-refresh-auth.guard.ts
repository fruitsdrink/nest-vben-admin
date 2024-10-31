import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT刷新 身份验证守卫
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
