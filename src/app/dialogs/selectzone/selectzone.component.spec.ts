import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectzoneComponent } from './selectzone.component';

describe('SelectzoneComponent', () => {
  let component: SelectzoneComponent;
  let fixture: ComponentFixture<SelectzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
