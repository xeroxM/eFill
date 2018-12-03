import { TestBed } from '@angular/core/testing';

import { MapStyleService } from './map-style.service';

describe('MapStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapStyleService = TestBed.get(MapStyleService);
    expect(service).toBeTruthy();
  });
});
