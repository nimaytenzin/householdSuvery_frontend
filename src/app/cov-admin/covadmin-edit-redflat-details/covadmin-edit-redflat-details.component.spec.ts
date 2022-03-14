import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminEditRedflatDetailsComponent } from './covadmin-edit-redflat-details.component';

describe('CovadminEditRedflatDetailsComponent', () => {
  let component: CovadminEditRedflatDetailsComponent;
  let fixture: ComponentFixture<CovadminEditRedflatDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminEditRedflatDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminEditRedflatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
