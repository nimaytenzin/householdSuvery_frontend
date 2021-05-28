import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPositiveComponent } from './view-positive.component';

describe('ViewPositiveComponent', () => {
  let component: ViewPositiveComponent;
  let fixture: ComponentFixture<ViewPositiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPositiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPositiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
