import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminEditRedCaseDetailsComponent } from './covadmin-edit-red-case-details.component';

describe('CovadminEditRedCaseDetailsComponent', () => {
  let component: CovadminEditRedCaseDetailsComponent;
  let fixture: ComponentFixture<CovadminEditRedCaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminEditRedCaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminEditRedCaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
