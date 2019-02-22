import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarprofilePage } from './carprofile.page';

describe('CarprofilePage', () => {
  let component: CarprofilePage;
  let fixture: ComponentFixture<CarprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
