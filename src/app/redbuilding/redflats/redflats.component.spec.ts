import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedflatsComponent } from './redflats.component';

describe('RedflatsComponent', () => {
  let component: RedflatsComponent;
  let fixture: ComponentFixture<RedflatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedflatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedflatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
