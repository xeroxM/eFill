import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MapStyleService} from '../../services/map-style/map-style.service';
import {NavigationService} from '../../services/navigation/navigation.service';
import {DataImportService} from '../../services/data-import/data-import.service';
import {NavController, Platform, PopoverController} from '@ionic/angular';
import {FilterComponent} from '../filter/filter.component';
import {ReachPopoverComponent} from '../reach-popover/reach-popover.component';

declare let google: any;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;

    public fabListActive = false;

    constructor(
        public mapStyleService: MapStyleService,
        public navigationService: NavigationService,
        public dataImport: DataImportService,
        private navCtrl: NavController,
        private platform: Platform,
        public popoverController: PopoverController) {
    }

    public moveToFavorites() {
        this.navCtrl.navigateForward('/tabs/(map:favorites)');
    }

    public showMap() {
        const location = new google.maps.LatLng(51.133481, 10.018343);

        const options = {
            center: location,
            zoom: 5.4,
            disableDefaultUI: true,
            clickableIcons: false,
            mapTypeIds: 'day_map, night_map'
        };

        const time = new Date().getHours();

        if (time < 6 || time > 19) {
            this.navigationService.map = new google.maps.Map(this.mapRef.nativeElement, options);
            this.navigationService.map.mapTypes.set('night_map', this.mapStyleService.mapStyleNight);
            this.navigationService.map.setMapTypeId('night_map');
        } else if (time >= 6 || time <= 19) {
            this.navigationService.map = new google.maps.Map(this.mapRef.nativeElement, options);
            this.navigationService.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
            this.navigationService.map.setMapTypeId('day_map');
        }
    }

    async presentFilterPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: FilterComponent,
            event: ev,
            translucent: true,
            cssClass: 'popover-class'
        });
        return await popover.present();
    }

    async presentReachPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: ReachPopoverComponent,
            event: ev,
            translucent: true,
            cssClass: 'popover-class'
        });
        return await popover.present();
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.showMap();
            this.dataImport.databaseReady.subscribe((data) => {
                if (data === true) {
                    this.navigationService.loadStationLocations();
                }
            });
        });
    }
}
