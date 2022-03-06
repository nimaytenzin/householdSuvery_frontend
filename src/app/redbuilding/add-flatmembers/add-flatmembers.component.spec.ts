import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlatmembersComponent } from './add-flatmembers.component';

describe('AddFlatmembersComponent', () => {
  let component: AddFlatmembersComponent;
  let fixture: ComponentFixture<AddFlatmembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFlatmembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlatmembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
