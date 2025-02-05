import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCupComponent } from './login-cup.component';

describe('LoginCupComponent', () => {
  let component: LoginCupComponent;
  let fixture: ComponentFixture<LoginCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
