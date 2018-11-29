import { TestBed } from '@angular/core/testing';

import { ProvideApikeyService } from './provide-apikey.service';

describe('ProvideApikeyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvideApikeyService = TestBed.get(ProvideApikeyService);
    expect(service).toBeTruthy();
  });
});
