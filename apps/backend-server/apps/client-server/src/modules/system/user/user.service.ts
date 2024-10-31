import { PrismaService } from '@app/common';
import { BaseService } from '@app/common/core';

import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dtos';
import { hash } from '@app/common/utils';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }
  /**
   * 根据Id查找用户
   * @param userId 用户Id
   * @returns
   */
  async findOne(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
        deletedAt: 0,
      },
    });
    return user;
  }

  /**
   * 更新刷新令牌
   * @param id 用户Id
   * @param refreshToken
   */
  async updateRefreshToken(id: string, refreshToken: string) {
    const hashRefreshToken = hash(refreshToken);
    // todo 存储到数据库
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refreshToken: hashRefreshToken,
      },
    });
  }

  findList() {
    const users = this.prismaService.user.findMany();
    return users;
  }
}
