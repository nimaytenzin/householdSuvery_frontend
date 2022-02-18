import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakPhasingComponent } from './outbreak-phasing.component';

describe('OutbreakPhasingComponent', () => {
  let component: OutbreakPhasingComponent;
  let fixture: ComponentFixture<OutbreakPhasingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutbreakPhasingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakPhasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
