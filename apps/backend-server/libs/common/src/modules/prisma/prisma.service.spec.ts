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
    const user = await service.user.findById('cm2ki3fas0000kg8vxwpqbrfo');
    expect(user).toBeDefined();
  });

  it('softDelete', async () => {
    const newUser = await service.user.create({
      data: {
        username: 'test',
        password: 'test',
        name: 'test',
        status: 1,
      },
    });
    const softDeletedUser = await service.user.softDelete({
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
    const user = await service.user.findFirst({
      where: {
        id: 'cm2ki3fas0000kg8vxwpqbrfo',
      },
    });

    // expect(deletedUser).toBeNull();
    expect(user).toBeDefined();
  });

  it('FindFirst-deleted', async () => {
    const deletedUser = await service.user.findFirst({
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
    const users = await service.user.findMany();
    expect(users.length).toEqual(1);
  });

  it('count', async () => {
    const count = await service.user.count();
    expect(count).toEqual(1);
  });
});
