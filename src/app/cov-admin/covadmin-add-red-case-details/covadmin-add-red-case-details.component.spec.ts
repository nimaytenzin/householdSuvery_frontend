import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminAddRedCaseDetailsComponent } from './covadmin-add-red-case-details.component';

describe('CovadminAddRedCaseDetailsComponent', () => {
  let component: CovadminAddRedCaseDetailsComponent;
  let fixture: ComponentFixture<CovadminAddRedCaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminAddRedCaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminAddRedCaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
