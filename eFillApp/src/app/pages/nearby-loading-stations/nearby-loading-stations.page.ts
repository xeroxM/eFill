import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-nearby-loading-stations',
    templateUrl: './nearby-loading-stations.page.html',
    styleUrls: ['./nearby-loading-stations.page.scss'],
})
export class NearbyLoadingStationsPage implements OnInit {

    constructor(public navigationService: NavigationService) {
    }

    ngOnInit() {
    }

}
