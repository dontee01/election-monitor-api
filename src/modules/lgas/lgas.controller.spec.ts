import { Test, TestingModule } from '@nestjs/testing';
import { LgasController } from './lgas.controller';

describe('LgasController', () => {
  let controller: LgasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LgasController],
    }).compile();

    controller = module.get<LgasController>(LgasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
