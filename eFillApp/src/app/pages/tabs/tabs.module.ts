import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs.router.module';

import {TabsPage} from './tabs.page';
import {FavoritesPageModule} from '../favorites/favorites.module';
import {MapPageModule} from '../map/map.module';
import {RoutePageModule} from '../route/route.module';
import {CarprofilePageModule} from '../carprofile/carprofile.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        MapPageModule,
        FavoritesPageModule,
        RoutePageModule,
        CarprofilePageModule
    ],
    declarations: [TabsPage]
})
export class TabsPageModule {
}
