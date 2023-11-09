import { TestBed } from '@angular/core/testing';

import { NoLogueadoGuard } from './no-logueado.guard';

describe('NoLogueadoGuard', () => {
  let guard: NoLogueadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoLogueadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
