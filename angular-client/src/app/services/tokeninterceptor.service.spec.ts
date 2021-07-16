import { TestBed } from '@angular/core/testing';

import { TokeninterceptorService } from './tokeninterceptor.service';

describe('TokeninterceptorService', () => {
  let service: TokeninterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokeninterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
