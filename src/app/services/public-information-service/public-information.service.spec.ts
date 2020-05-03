import { TestBed } from '@angular/core/testing';

import { PublicInformationService } from './public-information.service';

describe('PublicInformationService', () => {
  let service: PublicInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
