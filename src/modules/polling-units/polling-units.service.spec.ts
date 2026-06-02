import { Test, TestingModule } from '@nestjs/testing';
import { PollingUnitsService } from './polling-units.service';

describe('PollingUnitsService', () => {
  let service: PollingUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingUnitsService],
    }).compile();

    service = module.get<PollingUnitsService>(PollingUnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
