import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CommonModule } from '@app/common';

describe('UserService', () => {
  let service: UserService;
  const adminId = 'cm2ki3fas0000kg8vxwpqbrfo';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne', async () => {
    const user = await service.findOne(adminId);
    expect(user).toBeDefined();
  });

  it('findOneByUsername', async () => {
    const user = await service.findOneByUsername('admin');
    expect(user).toBeDefined();
  });

  it('findList', async () => {
    const users = await service.findList();
    expect(users.length).toEqual(1);
  });
});
