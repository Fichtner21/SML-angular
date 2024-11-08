import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClanComponent } from './edit-clan.component';

describe('EditClanComponent', () => {
  let component: EditClanComponent;
  let fixture: ComponentFixture<EditClanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
