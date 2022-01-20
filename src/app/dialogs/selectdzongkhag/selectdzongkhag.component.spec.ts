import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectdzongkhagComponent } from './selectdzongkhag.component';

describe('SelectdzongkhagComponent', () => {
  let component: SelectdzongkhagComponent;
  let fixture: ComponentFixture<SelectdzongkhagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectdzongkhagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectdzongkhagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
