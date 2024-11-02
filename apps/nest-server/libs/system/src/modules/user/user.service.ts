import { BaseService, type FindManyService, type FindOneService } from '@app/common';
import { PrismaService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { SysUser, type $Enums, type Prisma } from '@prisma/client';
import type { FindManyDto } from './dtos';

@Injectable()
export class SysUserService
  extends BaseService
  implements FindOneService<SysUser | null>, FindManyService<FindManyDto, SysUser>
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

  findMany(query: FindManyDto): Promise<SysUser[]> {
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

    return this.prisma.sysUser.findMany({
      where,
    });
  }

  findOne(id: string): Promise<SysUser | null> {
    if (!id) {
      return null;
    }
    return this.prisma.sysUser.findById(id);
  }
}
