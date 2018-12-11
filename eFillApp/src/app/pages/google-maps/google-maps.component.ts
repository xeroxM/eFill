import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {MapStyleService} from '../../services/map-style/map-style.service';
import {NavigationService} from '../../services/navigation/navigation.service';

declare let google: any;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;
    @ViewChild('directionsPanel') directionsPanel: ElementRef;

    public map: any;
    public markers: any;
    public geocoder: any;
    public GooglePlaces: any;
    public autocomplete: any;
    public GoogleAutocomplete: any;
    public autocompleteItems: any;

    constructor(
        public mapStyleService: MapStyleService,
        public navigationService: NavigationService,
        public zone: NgZone) {
        this.geocoder = new google.maps.Geocoder;
        const elem = document.createElement('div');
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        this.markers = [];
    }

    public showMap() {
        const location = new google.maps.LatLng(51.133481, 10.018343);

        const options = {
            center: location,
            zoom: 5.8,
            disableDefaultUI: true,
            clickableIcons: false,
            mapTypeIds: 'day_map'
        };

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
        this.map.setMapTypeId('day_map');
    }

    public setToCurrentLocation() {
        this.navigationService.getCurrentLocation(this.map);
    }

    public setToSelectedLocation(item) {
        this.navigationService.selectSearchResult(item, this.map);
    }

    ngOnInit() {
        this.showMap();
        // this.navigationService.startNavigation(this.map, this.directionsPanel);
    }

}
