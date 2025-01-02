import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdateEloAaComponent } from './confirm-update-elo-aa.component';

describe('ConfirmUpdateEloAaComponent', () => {
  let component: ConfirmUpdateEloAaComponent;
  let fixture: ComponentFixture<ConfirmUpdateEloAaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateEloAaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUpdateEloAaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
