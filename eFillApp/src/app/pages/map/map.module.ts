import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MapPage} from './map.page';
import {GoogleMapsComponent} from '../google-maps/google-maps.component';
import {RoutePageModule} from '../route/route.module';


@NgModule({
    declarations: [MapPage, GoogleMapsComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RoutePageModule,
        RouterModule.forChild([{path: '', component: MapPage}]),
    ]
})
export class MapPageModule {
}
