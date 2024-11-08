import { BaseService, type FindMany, type FindOne } from '@app/common';
import { PrismaService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { SysUser, type Prisma } from '@prisma/client';
import type { FindManyDto } from './dtos';

@Injectable()
export class SysUserService
  extends BaseService
  implements FindOne<SysUser | null>, FindMany<FindManyDto, SysUser>
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private validateFindMany(query: FindManyDto): FindManyDto {
    let { keyword, phone } = query;

    if (keyword) {
      keyword = keyword.trim();
    }
    if (phone) {
      phone = phone.trim();
    }
    return { keyword, phone };
  }

  async findMany(query: FindManyDto): Promise<SysUser[]> {
    const dto = this.validateFindMany(query);
    const { keyword, phone } = dto;

    const where: Prisma.SysUserWhereInput = {};
    if (keyword) {
      where.OR = [
        {
          username: {
            contains: keyword,
          },
        },
        {
          nickName: {
            contains: keyword,
          },
        },
        {
          realName: {
            contains: keyword,
          },
        },
      ];
    }

    if (phone) {
      where.phone = phone;
    }

    return await this.prisma.sysUser.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<SysUser | null> {
    if (!id) {
      return null;
    }
    return await this.prisma.sysUser.findById(id);
  }
}
