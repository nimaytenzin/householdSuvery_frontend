import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRedmemberComponent } from './edit-redmember.component';

describe('EditRedmemberComponent', () => {
  let component: EditRedmemberComponent;
  let fixture: ComponentFixture<EditRedmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRedmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRedmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
