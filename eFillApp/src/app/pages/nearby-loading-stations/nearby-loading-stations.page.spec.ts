import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NearbyLoadingStationsPage} from './nearby-loading-stations.page';

describe('NearbyLoadingStationsPage', () => {
    let component: NearbyLoadingStationsPage;
    let fixture: ComponentFixture<NearbyLoadingStationsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NearbyLoadingStationsPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NearbyLoadingStationsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
