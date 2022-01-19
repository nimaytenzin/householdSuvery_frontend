import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRedBuildingDialogComponent } from './create-red-building-dialog.component';

describe('CreateRedBuildingDialogComponent', () => {
  let component: CreateRedBuildingDialogComponent;
  let fixture: ComponentFixture<CreateRedBuildingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRedBuildingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRedBuildingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
