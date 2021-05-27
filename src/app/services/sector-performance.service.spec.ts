import { TestBed } from '@angular/core/testing';

import { SectorPerformanceService } from './sector-performance.service';

describe('SectorPerformanceService', () => {
  let service: SectorPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectorPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
