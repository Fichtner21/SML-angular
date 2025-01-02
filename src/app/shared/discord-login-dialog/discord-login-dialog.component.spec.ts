import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordLoginDialogComponent } from './discord-login-dialog.component';

describe('DiscordLoginDialogComponent', () => {
  let component: DiscordLoginDialogComponent;
  let fixture: ComponentFixture<DiscordLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordLoginDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscordLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
