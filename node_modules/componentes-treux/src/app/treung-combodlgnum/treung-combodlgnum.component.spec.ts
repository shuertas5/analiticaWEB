import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungCombodlgnumComponent } from './treung-combodlgnum.component';

describe('TreungCombodlgnumComponent', () => {
  let component: TreungCombodlgnumComponent;
  let fixture: ComponentFixture<TreungCombodlgnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungCombodlgnumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungCombodlgnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
