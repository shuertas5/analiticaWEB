import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungCombodlgComponent } from './treung-combodlg.component';

describe('TreungCombodlgComponent', () => {
  let component: TreungCombodlgComponent;
  let fixture: ComponentFixture<TreungCombodlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungCombodlgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungCombodlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
