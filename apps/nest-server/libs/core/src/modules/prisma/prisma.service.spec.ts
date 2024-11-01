import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById', async () => {
    const user = await service.sysUser.findById('cm2ki3fas0000kg8vxwpqbrfo');

    expect(user).toBeDefined();
  });

  it('softDelete', async () => {
    const newUser = await service.sysUser.create({
      data: {
        username: 'test',
        password: 'test',
        status: 1,
      },
    });
    const softDeletedUser = await service.sysUser.softDelete({
      where: {
        id: newUser.id,
      },
      deletedBy: 'test',
    });
    console.log(softDeletedUser);
    expect(softDeletedUser).toBeDefined();
  });

  it('FindFirst', async () => {
    // const deletedUser = await service.user.findFirst({
    //   where: {
    //     id: 'cm2lwrsr80000cxu9jcnwzs49',
    //   },
    // });
    const user = await service.sysUser.findFirst({
      where: {
        id: 'cm2ki3fas0000kg8vxwpqbrfo',
      },
    });

    // expect(deletedUser).toBeNull();
    expect(user).toBeDefined();
  });

  it('FindFirst-deleted', async () => {
    const deletedUser = await service.sysUser.findFirst({
      where: {
        id: 'cm2lwrsr80000cxu9jcnwzs49',
      },
      select: {
        id: true,
      },
    });

    expect(deletedUser).toBeNull();
  });

  it('findMany', async () => {
    const users = await service.sysUser.findMany();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it('count', async () => {
    const count = await service.sysUser.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
