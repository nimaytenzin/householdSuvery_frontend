import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakDzongkhagComponent } from './outbreak-dzongkhag.component';

describe('OutbreakDzongkhagComponent', () => {
  let component: OutbreakDzongkhagComponent;
  let fixture: ComponentFixture<OutbreakDzongkhagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutbreakDzongkhagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakDzongkhagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
