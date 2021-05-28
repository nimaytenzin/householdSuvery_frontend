import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovAdminComponent } from './cov-admin.component';

describe('CovAdminComponent', () => {
  let component: CovAdminComponent;
  let fixture: ComponentFixture<CovAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
