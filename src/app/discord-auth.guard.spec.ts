import { TestBed } from '@angular/core/testing';

import { DiscordAuthGuard } from './discord-auth.guard';

describe('DiscordAuthGuard', () => {
  let guard: DiscordAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DiscordAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
