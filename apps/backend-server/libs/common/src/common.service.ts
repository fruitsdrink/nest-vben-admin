import { Injectable } from '@nestjs/common';
import { CaptchaService } from './modules/captcha';

@Injectable()
export class CommonService {
  constructor(public readonly captcha: CaptchaService) {}
}
