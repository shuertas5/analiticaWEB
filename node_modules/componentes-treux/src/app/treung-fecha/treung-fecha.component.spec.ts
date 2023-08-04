import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungFechaComponent } from './treung-fecha.component';

describe('TreungFechaComponent', () => {
  let component: TreungFechaComponent;
  let fixture: ComponentFixture<TreungFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungFechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
