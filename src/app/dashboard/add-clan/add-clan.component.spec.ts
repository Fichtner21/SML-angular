import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClanComponent } from './add-clan.component';

describe('AddClanComponent', () => {
  let component: AddClanComponent;
  let fixture: ComponentFixture<AddClanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
