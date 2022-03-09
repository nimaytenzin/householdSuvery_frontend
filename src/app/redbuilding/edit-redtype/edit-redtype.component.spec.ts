import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRedtypeComponent } from './edit-redtype.component';

describe('EditRedtypeComponent', () => {
  let component: EditRedtypeComponent;
  let fixture: ComponentFixture<EditRedtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRedtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRedtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
