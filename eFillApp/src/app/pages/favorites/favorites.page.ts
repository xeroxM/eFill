import {Component} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-contact',
    templateUrl: 'favorites.page.html',
    styleUrls: ['favorites.page.scss']
})
export class FavoritesPage {
    constructor(public navigationService: NavigationService) {
    }

}
