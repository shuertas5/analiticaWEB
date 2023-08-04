import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungTextareaComponent } from './treung-textarea.component';

describe('TreungTextareaComponent', () => {
  let component: TreungTextareaComponent;
  let fixture: ComponentFixture<TreungTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungTextareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
