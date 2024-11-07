import { CurrentUser, type PaginationDto } from '@app/common';
import { SystemService } from '@app/system';
import {
  CreateDto,
  FindListDto,
  FindManyDto,
  UpdateDto,
} from '@app/system/modules/department/dtos';
import { Body, Injectable } from '@nestjs/common';
import { SysUser } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly systemService: SystemService) {}
  async findOne(id: string) {
    return await this.systemService.department.findOne(id);
  }

  async findMany(query: FindManyDto) {
    return await this.systemService.department.findMany(query);
  }

  async findList(page: PaginationDto, query: FindListDto) {
    return await this.systemService.department.findList({ ...page, ...query });
  }

  async create(@Body() data: CreateDto, @CurrentUser() user: SysUser) {
    return await this.systemService.department.create(data, user.id);
  }

  async update(id: string, data: UpdateDto, user: SysUser) {
    return await this.systemService.department.update(id, data, user.id);
  }

  async delete(id: string, user: SysUser) {
    return await this.systemService.department.delete(id, user.id);
  }
}
