import { TestBed } from '@angular/core/testing';

import { FetchMatchesService } from './fetch-matches.service';

describe('FetchMatchesService', () => {
  let service: FetchMatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchMatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
