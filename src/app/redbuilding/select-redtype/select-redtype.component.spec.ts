import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRedtypeComponent } from './select-redtype.component';

describe('SelectRedtypeComponent', () => {
  let component: SelectRedtypeComponent;
  let fixture: ComponentFixture<SelectRedtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRedtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRedtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
