import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingObjAaComponent } from './ranking-obj-aa.component';

describe('RankingObjAaComponent', () => {
  let component: RankingObjAaComponent;
  let fixture: ComponentFixture<RankingObjAaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingObjAaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingObjAaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
