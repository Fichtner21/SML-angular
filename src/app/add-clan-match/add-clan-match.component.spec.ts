import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClanMatchComponent } from './add-clan-match.component';

describe('AddClanMatchComponent', () => {
  let component: AddClanMatchComponent;
  let fixture: ComponentFixture<AddClanMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClanMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClanMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
