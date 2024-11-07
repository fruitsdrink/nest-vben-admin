import { Test, TestingModule } from '@nestjs/testing';
import { SysDepartmentService } from './department.service';
import { CoreModule } from '@app/core';
import type { CreateDto, UpdateDto } from './dtos';

describe('DepartmentService', () => {
  let service: SysDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [SysDepartmentService],
    }).compile();

    service = module.get<SysDepartmentService>(SysDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const data: CreateDto = {
      name: '测试部门01',
    };

    const result = await service.create(data);
    expect(result).toBeDefined();
  });

  it('create with parentId', async () => {
    const data: CreateDto = {
      name: '测试部门02',
      parentId: 'cm36vpj5a0000dohkccb13ngj',
    };

    const result = await service.create(data);
    expect(result).toBeDefined();
  });

  it('update', async () => {
    const id = 'cm36vz6a00001f7k3bi47wfu4';
    const data: UpdateDto = {
      name: '测试部门01-01',
      leader: null,
    };

    const result = await service.update(id, data);
    expect(result).toBeDefined();
  });

  it('delete', async () => {
    const data: CreateDto = {
      name: '测试删除部门',
    };
    const result = await service.create(data);
    expect(result).toBeDefined();
    const id = result.id;
    await service.delete(id);
    const exist = await service.findOne(id);
    expect(exist).toBeNull();
  });
});
