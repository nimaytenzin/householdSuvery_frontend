import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRedmemberComponent } from './delete-redmember.component';

describe('DeleteRedmemberComponent', () => {
  let component: DeleteRedmemberComponent;
  let fixture: ComponentFixture<DeleteRedmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRedmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRedmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
