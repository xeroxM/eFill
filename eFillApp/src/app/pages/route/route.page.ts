import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-route',
    templateUrl: './route.page.html',
    styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {

    public saveWayPoint = {};
    public saveWayPointIndex = 0;
    // public savePlugType = {};
    // public savePlugTypeIndex = 0;

    constructor(public navigationService: NavigationService) {
    }

    test() {
        console.log(this.navigationService.routeForm.value);
    }

    ngOnInit() {
    }

}
