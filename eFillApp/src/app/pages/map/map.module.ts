import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MapPage} from './map.page';
import {GoogleMapsComponent} from '../google-maps/google-maps.component';
import {RoutePageModule} from '../route/route.module';
import {NearbyLoadingStationsPageModule} from '../nearby-loading-stations/nearby-loading-stations.module';
import {FilterComponent} from '../filter/filter.component';


@NgModule({
    declarations: [MapPage, GoogleMapsComponent, FilterComponent],
    entryComponents: [FilterComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RoutePageModule,
        NearbyLoadingStationsPageModule,
        RouterModule.forChild([{path: '', component: MapPage}]),
    ]
})
export class MapPageModule {
}
