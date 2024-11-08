import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEloComponent } from './update-elo.component';

describe('UpdateEloComponent', () => {
  let component: UpdateEloComponent;
  let fixture: ComponentFixture<UpdateEloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
