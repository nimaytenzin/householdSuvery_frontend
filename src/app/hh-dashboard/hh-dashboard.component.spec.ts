import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HhDashboardComponent } from './hh-dashboard.component';

describe('HhDashboardComponent', () => {
  let component: HhDashboardComponent;
  let fixture: ComponentFixture<HhDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HhDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HhDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
