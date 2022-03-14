import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminEditRedbuildingDetailsComponent } from './covadmin-edit-redbuilding-details.component';

describe('CovadminEditRedbuildingDetailsComponent', () => {
  let component: CovadminEditRedbuildingDetailsComponent;
  let fixture: ComponentFixture<CovadminEditRedbuildingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminEditRedbuildingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminEditRedbuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
