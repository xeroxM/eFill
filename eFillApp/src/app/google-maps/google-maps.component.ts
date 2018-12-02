import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MapStyleService} from '../services/map-style.service';

declare var google: any;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;

    map: any;

    constructor(public mapStyleService: MapStyleService) {
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
        console.log(this.mapRef);
    }

}
