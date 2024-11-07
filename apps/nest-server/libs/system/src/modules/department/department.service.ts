import {
  BaseService,
  pinyinHelper,
  type CRUD,
  type FindList,
  type FindMany,
  type FindOne,
  type PaginationDto,
  type PaginationResult,
} from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, SysDepartment } from '@prisma/client';
import { CreateDto, FindListDto, FindManyDto, UpdateDto } from './dtos';
import { PrismaService } from '@app/core';

@Injectable()
export class SysDepartmentService
  extends BaseService
  implements CRUD<SysDepartment, FindManyDto, FindListDto, CreateDto, UpdateDto>
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async validateCreate(data: CreateDto) {
    let { name } = data;
    if (!name || !name.trim()) {
      throw new BadRequestException('部门名称不能为空');
    }
    name = name.trim();
    const exist = await this.prisma.sysDepartment.findFirst({
      where: {
        name,
      },
    });
    if (exist) {
      throw new BadRequestException('部门名称已存在');
    }

    const { parentId } = data;
    if (parentId) {
      const parent = await this.prisma.sysDepartment.findById(parentId);
      if (!parent) {
        throw new BadRequestException('上级部门不存在');
      }
    }

    const pinyin = pinyinHelper.getFirstChar(name);

    const { sortNo, status } = data;
    return {
      ...data,
      name,
      pinyin,
      sortNo: sortNo || 0,
      status: status === 0 || status === 1 ? status : 1,
    };
  }

  async create(data: CreateDto, userId: string): Promise<SysDepartment> {
    const dto = await this.validateCreate(data);
    return await this.prisma.sysDepartment.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });
  }

  private async validateUpdate(id: string, data: UpdateDto) {
    if (!id) {
      throw new BadRequestException('ID 不能为空');
    }
    const dept = await this.prisma.sysDepartment.findById(id);
    if (!dept) {
      throw new BadRequestException('部门不存在');
    }

    let { name } = data;
    if (!name || !name.trim()) {
      throw new BadRequestException('部门名称不能为空');
    }
    name = name.trim();
    const exist = await this.prisma.sysDepartment.findFirst({
      where: {
        name,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new BadRequestException('部门名称已存在');
    }

    const { parentId } = data;
    if (parentId) {
      if (parentId === id) {
        throw new BadRequestException('上级部门不能是自己');
      }
      const parent = await this.prisma.sysDepartment.findById(parentId);
      if (!parent) {
        throw new BadRequestException('上级部门不存在');
      }
    }

    const pinyin = pinyinHelper.getFirstChar(name);

    const { sortNo, status } = data;
    return {
      ...data,
      name,
      pinyin,
      sortNo: sortNo || 0,
      status: status === 0 || status === 1 ? status : 1,
    };
  }

  async update(id: string, data: UpdateDto, userId: string): Promise<SysDepartment> {
    const dto = await this.validateUpdate(id, data);
    return await this.prisma.sysDepartment.update({
      where: {
        id,
      },
      data: {
        ...dto,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  }

  private async validateDelete(id: string) {
    const dept = await this.prisma.sysDepartment.findById(id);
    if (!dept) {
      throw new BadRequestException('部门不存在');
    }
    return dept;
  }
  async delete(id: string, userId: string): Promise<SysDepartment> {
    await this.validateDelete(id);
    return await this.prisma.sysDepartment.softDelete({
      where: {
        id,
      },
      deletedBy: userId,
    });
  }

  async findOne(id: string): Promise<SysDepartment | null> {
    if (!id) {
      return null;
    }

    return await this.prisma.sysDepartment.findById(id, {
      include: {
        parent: {
          where: {
            deletedAt: 0,
          },
        },
      },
    });
  }

  private validateFindMany(query: FindManyDto) {
    const { keyword, status } = query;
    return {
      keyword: keyword?.trim(),
      status: status === '0' || status === '1' ? parseInt(status) : undefined,
    };
  }
  async findMany(query: FindManyDto): Promise<SysDepartment[]> {
    const { keyword, status } = this.validateFindMany(query);

    const where: Prisma.SysDepartmentWhereInput = {
      status,
    };
    if (keyword) {
      where.OR = [
        {
          name: {
            contains: keyword,
          },
        },
        {
          pinyin: {
            contains: keyword,
          },
        },
      ];
    }

    return await this.prisma.sysDepartment.findMany({
      where,
      include: {
        parent: { where: { deletedAt: 0 } },
        children: {
          where: {
            deletedAt: 0,
          },
        },
      },
    });
  }

  private validateDto(query: FindListDto) {
    const { keyword, status } = query;
    return {
      keyword: keyword?.trim(),
      status: status === '0' || status === '1' ? parseInt(status) : undefined,
    };
  }
  async findList(query: PaginationDto & FindListDto): Promise<PaginationResult<SysDepartment>> {
    const { keyword, status } = this.validateDto(query);
    const { pageNumber, pageSize, orderBy, orderType } = query;
    const where: Prisma.SysDepartmentWhereInput = {
      status,
      parent: {
        is: null,
      },
    };
    if (keyword) {
      where.OR = [
        {
          name: {
            contains: keyword,
          },
        },
        {
          pinyin: {
            contains: keyword,
          },
        },
      ];
    }

    return await this.prisma.sysDepartment.pagination(
      {
        where,
        include: {
          parent: {
            where: {
              deletedAt: 0,
            },
          },
          children: {
            where: {
              deletedAt: 0,
            },
          },
        },
      },
      {
        pageNumber,
        pageSize,
        order: orderBy
          ? {
              fieldName: orderBy,
              direction: orderType ? 'desc' : 'asc',
            }
          : undefined,
      },
    );
  }
}
