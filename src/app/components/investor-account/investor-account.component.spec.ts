import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorAccountComponent } from './investor-account.component';

describe('InvestorAccountComponent', () => {
  let component: InvestorAccountComponent;
  let fixture: ComponentFixture<InvestorAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
