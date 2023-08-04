import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreungPasswordComponent } from './treung-password.component';

describe('TreungPasswordComponent', () => {
  let component: TreungPasswordComponent;
  let fixture: ComponentFixture<TreungPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreungPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreungPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
