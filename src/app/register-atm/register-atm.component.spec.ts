import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAtmComponent } from './register-atm.component';

describe('RegisterAtmComponent', () => {
  let component: RegisterAtmComponent;
  let fixture: ComponentFixture<RegisterAtmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAtmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
