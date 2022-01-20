import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsDrawerComponent } from './apps-drawer.component';

describe('AppsDrawerComponent', () => {
  let component: AppsDrawerComponent;
  let fixture: ComponentFixture<AppsDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
