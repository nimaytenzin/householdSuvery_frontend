import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSealhistoryComponent } from './add-sealhistory.component';

describe('AddSealhistoryComponent', () => {
  let component: AddSealhistoryComponent;
  let fixture: ComponentFixture<AddSealhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSealhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSealhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
