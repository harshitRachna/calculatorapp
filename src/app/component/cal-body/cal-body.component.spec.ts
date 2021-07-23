import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalBodyComponent } from './cal-body.component';

describe('CalBodyComponent', () => {
  let component: CalBodyComponent;
  let fixture: ComponentFixture<CalBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
