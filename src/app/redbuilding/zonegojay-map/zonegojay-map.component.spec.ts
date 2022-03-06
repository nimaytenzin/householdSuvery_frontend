import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonegojayMapComponent } from './zonegojay-map.component';

describe('ZonegojayMapComponent', () => {
  let component: ZonegojayMapComponent;
  let fixture: ComponentFixture<ZonegojayMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonegojayMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonegojayMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
