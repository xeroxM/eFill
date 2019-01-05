import {Component} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-about',
    templateUrl: 'map.page.html',
    styleUrls: ['map.page.scss']
})
export class MapPage {

    constructor(public navigationService: NavigationService,
                public navCtrl: NavController) {
    }

    public moveToSetRoute() {
        this.navCtrl.navigateForward('/tabs/(map:route)');
    }

}
