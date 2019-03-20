import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-reach-popover',
    templateUrl: './reach-popover.component.html',
    styleUrls: ['./reach-popover.component.scss']
})
export class ReachPopoverComponent implements OnInit {

    public reach;

    constructor(public popoverController: PopoverController, public navigationService: NavigationService) {
    }

    public updateReach(reach) {
        this.popoverController.dismiss();
        this.navigationService.greenCircle.setMap(null);
        this.navigationService.yellowCircle.setMap(null);
        this.navigationService.redCircle.setMap(null);
        this.navigationService.calculateReach(reach);
    }

    ngOnInit() {
    }

}
