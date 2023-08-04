import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungTextoComponent } from './treung-texto.component';

describe('TreungTextoComponent', () => {
  let component: TreungTextoComponent;
  let fixture: ComponentFixture<TreungTextoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungTextoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungTextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
