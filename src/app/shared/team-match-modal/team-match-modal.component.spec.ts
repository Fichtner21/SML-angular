import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMatchModalComponent } from './team-match-modal.component';

describe('TeamMatchModalComponent', () => {
  let component: TeamMatchModalComponent;
  let fixture: ComponentFixture<TeamMatchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMatchModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
