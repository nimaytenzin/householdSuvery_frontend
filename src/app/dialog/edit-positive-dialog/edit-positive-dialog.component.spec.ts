import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPositiveDialogComponent } from './edit-positive-dialog.component';

describe('EditPositiveDialogComponent', () => {
  let component: EditPositiveDialogComponent;
  let fixture: ComponentFixture<EditPositiveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPositiveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPositiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
