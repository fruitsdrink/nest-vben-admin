import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { SystemModule } from '@app/system';
import { DepartmentService } from './department.service';

describe('DepartmentController', () => {
  let controller: DepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SystemModule],
      controllers: [DepartmentController],
      providers: [DepartmentService],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findOne', async () => {
    const result = await controller.findOne('cm36vpj5a0000dohkccb13ngj');
    expect(result).toBeDefined();
  });
});
