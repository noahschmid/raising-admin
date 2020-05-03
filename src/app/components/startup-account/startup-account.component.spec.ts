import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupAccountComponent } from './startup-account.component';

describe('StartupAccountComponent', () => {
  let component: StartupAccountComponent;
  let fixture: ComponentFixture<StartupAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartupAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartupAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
