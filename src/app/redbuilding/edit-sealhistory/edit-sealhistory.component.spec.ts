import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSealhistoryComponent } from './edit-sealhistory.component';

describe('EditSealhistoryComponent', () => {
  let component: EditSealhistoryComponent;
  let fixture: ComponentFixture<EditSealhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSealhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSealhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
