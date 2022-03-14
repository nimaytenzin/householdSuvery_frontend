import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovadminAddRedbuildingDetailsComponent } from './covadmin-add-redbuilding-details.component';

describe('CovadminAddRedbuildingDetailsComponent', () => {
  let component: CovadminAddRedbuildingDetailsComponent;
  let fixture: ComponentFixture<CovadminAddRedbuildingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovadminAddRedbuildingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovadminAddRedbuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
