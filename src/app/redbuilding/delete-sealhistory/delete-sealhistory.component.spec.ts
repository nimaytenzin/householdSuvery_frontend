import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSealhistoryComponent } from './delete-sealhistory.component';

describe('DeleteSealhistoryComponent', () => {
  let component: DeleteSealhistoryComponent;
  let fixture: ComponentFixture<DeleteSealhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSealhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSealhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
