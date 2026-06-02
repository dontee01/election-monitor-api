import { Test, TestingModule } from '@nestjs/testing';
import { PollingUnitsController } from './polling-units.controller';

describe('PollingUnitsController', () => {
  let controller: PollingUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollingUnitsController],
    }).compile();

    controller = module.get<PollingUnitsController>(PollingUnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
