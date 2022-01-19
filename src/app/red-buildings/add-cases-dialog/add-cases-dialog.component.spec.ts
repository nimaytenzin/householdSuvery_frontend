import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCasesDialogComponent } from './add-cases-dialog.component';

describe('AddCasesDialogComponent', () => {
  let component: AddCasesDialogComponent;
  let fixture: ComponentFixture<AddCasesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCasesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCasesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
