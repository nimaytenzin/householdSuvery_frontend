import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRedflatDialogComponent } from './add-redflat-dialog.component';

describe('AddRedflatDialogComponent', () => {
  let component: AddRedflatDialogComponent;
  let fixture: ComponentFixture<AddRedflatDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRedflatDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRedflatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
