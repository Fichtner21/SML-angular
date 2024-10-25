import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClanMatchesListComponent } from './clan-matches-list.component';

describe('ClanMatchesListComponent', () => {
  let component: ClanMatchesListComponent;
  let fixture: ComponentFixture<ClanMatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClanMatchesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClanMatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
