import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminAddRedflatComponent } from './covadmin-add-redflat.component';

describe('CovadminAddRedflatComponent', () => {
  let component: CovadminAddRedflatComponent;
  let fixture: ComponentFixture<CovadminAddRedflatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminAddRedflatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminAddRedflatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
