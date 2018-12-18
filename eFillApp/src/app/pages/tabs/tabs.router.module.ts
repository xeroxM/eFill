import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';
import {MapPage} from '../map/map.page';
import {FavoritesPage} from '../favorites/favorites.page';
import {RoutePage} from '../route/route.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: '/tabs/(map:map)',
                pathMatch: 'full',
            },
            {
                path: 'map',
                outlet: 'map',
                component: MapPage
            },
            {
                path: 'favorites',
                outlet: 'favorites',
                component: FavoritesPage
            },
            {
                path: 'route',
                outlet: 'route',
                component: RoutePage
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/(map:map)',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
