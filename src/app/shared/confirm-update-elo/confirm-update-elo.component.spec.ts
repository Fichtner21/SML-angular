import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdateEloComponent } from './confirm-update-elo.component';

describe('ConfirmUpdateEloComponent', () => {
  let component: ConfirmUpdateEloComponent;
  let fixture: ComponentFixture<ConfirmUpdateEloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateEloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUpdateEloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
