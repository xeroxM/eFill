import { TestBed } from '@angular/core/testing';

import { DataImportService } from './data-import.service';

describe('DataImportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataImportService = TestBed.get(DataImportService);
    expect(service).toBeTruthy();
  });
});
