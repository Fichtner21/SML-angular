import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixUsComponent } from './mix-us.component';

describe('MixUsComponent', () => {
  let component: MixUsComponent;
  let fixture: ComponentFixture<MixUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MixUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MixUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
