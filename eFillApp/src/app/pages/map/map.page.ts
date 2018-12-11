import {Component} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-about',
    templateUrl: 'map.page.html',
    styleUrls: ['map.page.scss']
})
export class MapPage {

    constructor(public navigationService: NavigationService) {
    }

}
