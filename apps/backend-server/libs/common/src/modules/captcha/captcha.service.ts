import { Injectable } from '@nestjs/common';
// import pngCaptcha from 'png-captcha';
import { captchaPng } from '@repo/captcha';
import Keyv from 'keyv';
import { v4 as uuidv4 } from 'uuid';
import clc from 'cli-color';

type CaptchaOptions = {
  size?: number;
  noise?: number;
  background?: string;
  color?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
  inverse?: boolean;
  /**
   * 过期时间（毫秒）
   */
  ttl?: number;
  /**
   * 是否区分大小写
   */
  isCaseSensitive?: boolean;
};

type CaptchaResponse = {
  id: string;
  image: string;
};
@Injectable()
export class CaptchaService {
  private keyv: Keyv<string>;
  constructor() {
    this.keyv = new Keyv<number>();
  }
  /**
   * 生成验证码
   */
  async generate(options?: CaptchaOptions): Promise<CaptchaResponse> {
    const defaultOptions = { ...options, ignoreChars: 'Oo1Il' };
    defaultOptions.noise = defaultOptions.noise ?? 4;
    defaultOptions.color = defaultOptions.color ?? true;
    defaultOptions.size = defaultOptions.size ?? 4;
    defaultOptions.isCaseSensitive = defaultOptions.isCaseSensitive ?? false;

    const captcha = captchaPng.create(defaultOptions);
    let { text } = captcha;
    if (defaultOptions.isCaseSensitive === false) {
      text = text.toLowerCase();
    }

    let ttl = 1000 * 60; // 默认 60 秒
    if (options && options.ttl) {
      ttl = options.ttl;
    }

    const id = uuidv4();
    console.log(id);

    await this.keyv.set(id, text, ttl);

    // 是否为开发环境，如果是则打印验证码和Id
    if (process.env.NODE_ENV === 'development') {
      console.log(clc.red('captcha:'), text, id);
    }

    return { id, image: captcha.base64Image };
  }

  /**
   * 验证验证码
   * @param id 验证码Id
   * @param text 验证码文本
   * @returns 是否验证成功
   */
  async validate(id: string, text: string) {
    if (!id || !text) {
      return false;
    }
    const value = await this.keyv.get(id);
    if (!value || value !== text) {
      return false;
    }

    return true;
  }

  /**
   * 响应验证码图片
   */
  // responsePng(options?: CaptchaOptions) {
  //   const captcha = pngCaptcha.create(options);

  //   return new StreamableFile(captcha.image, {
  //     type: 'image/png',
  //   });
  // }
}
