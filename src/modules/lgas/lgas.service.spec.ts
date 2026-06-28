import { Test, TestingModule } from '@nestjs/testing';
import { LgasService } from './lgas.service';

describe('LgasService', () => {
  let service: LgasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LgasService],
    }).compile();

    service = module.get<LgasService>(LgasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
