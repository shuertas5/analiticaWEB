import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungNumerComponent } from './treung-numer.component';

describe('TreungNumerComponent', () => {
  let component: TreungNumerComponent;
  let fixture: ComponentFixture<TreungNumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungNumerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungNumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
