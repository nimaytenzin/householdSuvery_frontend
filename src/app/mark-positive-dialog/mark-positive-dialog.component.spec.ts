import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkPositiveDialogComponent } from './mark-positive-dialog.component';

describe('MarkPositiveDialogComponent', () => {
  let component: MarkPositiveDialogComponent;
  let fixture: ComponentFixture<MarkPositiveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkPositiveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkPositiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
