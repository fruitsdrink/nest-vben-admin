import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AppConfigService } from '../app-config';
import { TokenPayload } from './interfaces';
import { UserService } from '../user';
import { compare, hash, passwordHelper, pinyinHelper } from '@app/common/utils';
import { CommonService, PrismaService } from '@app/common';
import { RegisterRequestDto, UserLoginRequestDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 登录
   * @param user 用户
   * @param response 响应
   */
  async login(user: { id: string }, response: Response) {
    // jwt 过期时间
    const expiresIn = new Date();
    expiresIn.setMilliseconds(expiresIn.getTime() + this.appConfigService.jwtExpiresInMilliseconds);
    // jwt 刷新过期时间
    const refreshExpiresIn = new Date();
    refreshExpiresIn.setMilliseconds(
      refreshExpiresIn.getTime() + this.appConfigService.jwtRefreshExpiresInMilliseconds,
    );

    const payload: TokenPayload = {
      userId: user.id,
    };

    // 生成 jwt 令牌
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: this.appConfigService.jwtExpiresIn,
    });

    // 生成 jwt 刷新令牌
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpiresIn,
    });

    // 将刷新令牌存储到数据库
    await this.userService.updateRefreshToken(user.id, refreshToken);

    response.cookie('Authentication', accessToken, {
      expires: expiresIn,
      secure: this.appConfigService.jwtCookieSecure,
      httpOnly: true,
    });

    response.cookie('Refresh', refreshToken, {
      expires: refreshExpiresIn,
      secure: this.appConfigService.jwtCookieSecure,
      httpOnly: true,
    });

    return {
      isok: true,
    };
  }

  /**
   * 登录验证用户
   * @param data 用户登录请求数据
   * @returns
   */
  async verifyUser(data: UserLoginRequestDto) {
    const { username, password, captchaId, captchaText } = data;

    const user = await this.userService.findOneByUsername(username);

    if (!user || !user.status) {
      throw new BadRequestException('登录帐号或密码错误');
    }

    const authenticated = compare(password, user.password);

    if (!authenticated) {
      throw new BadRequestException('登录帐号或密码错误');
    }
    if ((await this.appConfigService.captchaType()) > 0) {
      if (!captchaId || !captchaText) {
        throw new BadRequestException('验证码错误');
      }

      const match = await this.commonService.captcha.validate(captchaId, captchaText);

      if (!match) {
        throw new BadRequestException('验证码错误');
      }
    }

    return user;
  }

  async verfiyUserToken(payload: TokenPayload) {
    try {
      const user = await this.userService.findOne(payload.userId);
      if (!user || !user.status) {
        throw new UnauthorizedException('用户不存在');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('令牌失效');
    }
  }

  /**
   * 验证用户刷新令牌
   * @param userId 用户Id
   * @param refreshToken 刷新令牌
   * @returns
   */
  async verifyUserRefreshToken(userId: string, refreshToken: string) {
    try {
      const user = await this.userService.findOne(userId);
      if (!user || !user.status) {
        throw new UnauthorizedException('用户不存在');
      }

      const authenticated = compare(refreshToken, user.refreshToken);

      if (!authenticated) {
        throw new UnauthorizedException('刷新令牌验证错误');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('刷新令牌失效');
    }
  }

  /**
   * 创建验证码
   */
  async createCatpcha() {
    const [size, ttl, isCaseSensitive] = await Promise.all([
      this.appConfigService.captchaLength(),
      this.appConfigService.captchaTTLMilliseconds(),
      this.appConfigService.captchaCaseSensitive(),
    ]);

    return this.commonService.captcha.generate({
      size,
      ttl,
      isCaseSensitive,
    });
  }

  /**
   * 获取验证码类型
   */
  async getCaptchaType() {
    return await this.appConfigService.captchaType();
  }

  /**
   * 是否启用注册
   */
  async registerEnabled() {
    return await this.appConfigService.registerEnable();
  }

  private async validateRegister(data: RegisterRequestDto) {
    const enableRegister = await this.appConfigService.registerEnable();
    if (!enableRegister) {
      throw new BadRequestException('注册已关闭');
    }
    const { name, username, password } = data;
    if (!name) {
      throw new BadRequestException({
        field: name,
        message: '姓名不能为空',
      });
    }
    if (!username) {
      throw new BadRequestException({
        field: username,
        message: '登录帐号不能为空',
      });
    }
    if (!password) {
      throw new BadRequestException({
        field: password,
        message: '登录密码不能为空',
      });
    }
    const registerPasswordStrength = await this.appConfigService.registerPasswordStrength();
    if (registerPasswordStrength) {
      const result = passwordHelper.passwordStrength(password);
      if (result.id < registerPasswordStrength) {
        throw new BadRequestException({
          field: 'password',
          message: '密码强度不够',
        });
      }
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      throw new BadRequestException({
        field: 'username',
        message: '登录帐号已存在',
      });
    }

    return {
      ...data,
    };
  }
  async register(data: RegisterRequestDto) {
    const dto = await this.validateRegister(data);

    const pinyin = pinyinHelper.getFirstChar(dto.name);
    await this.prismaService.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        pinyin: pinyin ? pinyin : undefined,
        password: hash(dto.password),
        status: 1,
        isVerify: (await this.appConfigService.registerVerify()) ? 1 : 0,
        registerSource: 'SELF',
      },
    });

    return {
      isok: true,
    };
  }
}
