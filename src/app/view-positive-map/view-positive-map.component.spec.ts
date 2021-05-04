import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPositiveMapComponent } from './view-positive-map.component';

describe('ViewPositiveMapComponent', () => {
  let component: ViewPositiveMapComponent;
  let fixture: ComponentFixture<ViewPositiveMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPositiveMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPositiveMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
