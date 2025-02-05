import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotModalComponent } from './screenshot-modal.component';

describe('ScreenshotModalComponent', () => {
  let component: ScreenshotModalComponent;
  let fixture: ComponentFixture<ScreenshotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenshotModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenshotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
