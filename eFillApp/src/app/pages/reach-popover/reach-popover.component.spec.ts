import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachPopoverComponent } from './reach-popover.component';

describe('ReachPopoverComponent', () => {
  let component: ReachPopoverComponent;
  let fixture: ComponentFixture<ReachPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReachPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReachPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
