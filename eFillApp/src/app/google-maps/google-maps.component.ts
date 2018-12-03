import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MapStyleService} from '../services/map-style/map-style.service';
import {NavigationService} from '../services/navigation/navigation.service';

declare let google: any;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;
    @ViewChild('directionsPanel') directionsPanel: ElementRef;

    map: any;

    constructor(public mapStyleService: MapStyleService, public navigationService: NavigationService) {
    }

    public showMap() {
        const location = new google.maps.LatLng(50.927860, 6.927865);

        const options = {
            center: location,
            zoom: 13,
            disableDefaultUI: true,
            clickableIcons: false,
            mapTypeIds: 'day_map'
        };

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.addMarker(location, this.map);
        this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
        this.map.setMapTypeId('day_map');
    }

    public addMarker(position, map) {
        return new google.maps.Marker({
            position, map
        });
    }

    ngOnInit() {
        this.showMap();
        this.navigationService.startNavigation(this.map, this.directionsPanel);
    }

}
