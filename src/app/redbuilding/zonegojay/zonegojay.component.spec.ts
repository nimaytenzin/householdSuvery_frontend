import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonegojayComponent } from './zonegojay.component';

describe('ZonegojayComponent', () => {
  let component: ZonegojayComponent;
  let fixture: ComponentFixture<ZonegojayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonegojayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonegojayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
