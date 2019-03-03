import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NearbyLoadingStationsPage} from './nearby-loading-stations.page';

const routes: Routes = [
    {
        path: '',
        component: NearbyLoadingStationsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [NearbyLoadingStationsPage]
})
export class NearbyLoadingStationsPageModule {
}
