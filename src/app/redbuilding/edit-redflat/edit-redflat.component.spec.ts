import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRedflatComponent } from './edit-redflat.component';

describe('EditRedflatComponent', () => {
  let component: EditRedflatComponent;
  let fixture: ComponentFixture<EditRedflatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRedflatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRedflatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
