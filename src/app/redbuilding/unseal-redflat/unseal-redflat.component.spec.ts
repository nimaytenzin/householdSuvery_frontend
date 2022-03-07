import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsealRedflatComponent } from './unseal-redflat.component';

describe('UnsealRedflatComponent', () => {
  let component: UnsealRedflatComponent;
  let fixture: ComponentFixture<UnsealRedflatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsealRedflatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsealRedflatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
