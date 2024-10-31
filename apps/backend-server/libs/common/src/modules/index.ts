import { CaptchaModule, CaptchaService } from './captcha';
import { PrismaModule, PrismaService } from './prisma';

export const modules = [CaptchaModule, PrismaModule];
export const services = [CaptchaService, PrismaService];
