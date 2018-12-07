import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {MapStyleService} from '../services/map-style/map-style.service';
import {NavigationService} from '../services/navigation/navigation.service';
import { LoadingController } from '@ionic/angular';

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
    public nearbyItems: any = new Array<any>();
    public loading: any;

    constructor(
        public mapStyleService: MapStyleService,
        public navigationService: NavigationService,
        public zone: NgZone,
        public loadingCtrl: LoadingController) {
        this.geocoder = new google.maps.Geocoder;
        let elem = document.createElement("div");
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocompleteItems = [];
        this.markers = [];
        //this.loading = this.loadingCtrl.create();
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
        this.addMarker(location, this.map);
        this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
        this.map.setMapTypeId('day_map');
    }

    public addMarker(position, map) {
        return new google.maps.Marker({
            position, map
        });
    }

    public setToCurrentLocation() {
        this.navigationService.getCurrentLocation(this.map);
    }

    updateSearchResults(){
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
            (predictions, status) => {
                this.autocompleteItems = [];
                if(predictions){
                    this.zone.run(() => {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction);
                        });
                    });
                }
            });
    }

    selectSearchResult(item){
        this.clearMarkers();
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if(status === 'OK' && results[0]){
                // let position = {
                //     lat: results[0].geometry.location.lat,
                //     lng: results[0].geometry.location.lng
                // };
                let marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: this.map
                });
                this.markers.push(marker);
                this.map.setCenter(results[0].geometry.location);
            }
        })
    }

    clearMarkers(){
        for (var i = 0; i < this.markers.length; i++) {
            console.log(this.markers[i])
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }

    ngOnInit() {
        this.showMap();
        //this.navigationService.startNavigation(this.map, this.directionsPanel);
    }

}
