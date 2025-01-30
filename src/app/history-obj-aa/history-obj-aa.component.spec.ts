import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryObjAaComponent } from './history-obj-aa.component';

describe('HistoryObjAaComponent', () => {
  let component: HistoryObjAaComponent;
  let fixture: ComponentFixture<HistoryObjAaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryObjAaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryObjAaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
