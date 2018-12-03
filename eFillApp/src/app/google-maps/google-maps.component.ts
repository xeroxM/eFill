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
    @ViewChild('directionsPanel') directionsPanel: ElementRef;
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

    startNavigating() {

        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);

        directionsService.route({
            origin: {lat: 50.927860, lng: 6.927865},
            destination: {lat: 50.941357, lng: 6.958307},
            travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }

        });
    }

    ngOnInit() {
        this.showMap();
        this.startNavigating();
        console.log(this.mapRef);
    }

}
