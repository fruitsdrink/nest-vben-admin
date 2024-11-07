import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDto,
  FindListDto,
  FindManyDto,
  UpdateDto,
} from '@app/system/modules/department/dtos';
import { CurrentUser, Pagination, type PaginationDto } from '@app/common';
import { SysUser } from '@prisma/client';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get('find/many')
  async findMany(@Query() query: FindManyDto) {
    return await this.service.findMany(query);
  }

  @Get('find/list')
  async findList(@Pagination() page: PaginationDto, @Query() query: FindListDto) {
    return await this.service.findList(page, query);
  }

  @Post()
  async create(@Body() data: CreateDto, @CurrentUser() user: SysUser) {
    return await this.service.create(data, user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateDto, @CurrentUser() user: SysUser) {
    return await this.service.update(id, data, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: SysUser) {
    return await this.service.delete(id, user);
  }
}
