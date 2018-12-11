import {Injectable, NgZone} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DataImportService} from '../data-import/data-import.service';

declare let google: any;
declare let MarkerClusterer: any;

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    public geoLocLat: number;
    public geoLocLong: number;

    public markers: any;
    public geocoder: any;
    public GooglePlaces: any;
    public autocomplete: any;
    public GoogleAutocomplete: any;
    public autocompleteItems: any;

    public markers = [];
    public coords = [];
    public markerCluster: any;

    constructor(
        public geolocation: Geolocation,
        public zone: NgZone,
        public importData: DataImportService) {
        this.geocoder = new google.maps.Geocoder;
        const elem = document.createElement('div');
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        this.markers = [];
    }

    public getCurrentLocation(map) {
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
            map.setZoom(14);
        });
    }

    public loadStationLocations(map) {
        this.importData.getCoordinates().subscribe(data => {
            this.coords = data;
            for (let i = 0; i < this.coords.length; i++) {
                const location = new google.maps.LatLng(this.coords[i].lat, this.coords[i].long);
                const marker = this.addMarker(location, map);
                this.markers.push(marker);
            }
            this.markerCluster = new MarkerClusterer(map, this.markers);
        });
    }

    public addMarker(position, map) {
        return new google.maps.Marker({
            position, map
        });
    }


    public updateSearchResults() {
        if (this.autocomplete.input === null) {
            this.autocompleteItems = [];
            return;
        }

        this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input, componentRestrictions: {country: 'de'}},
            (predictions, status) => {
                this.autocompleteItems = [];
                if (predictions) {
                    this.zone.run(() => {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction);
                        });
                    });
                }
            });
    }

    public selectSearchResult(item, map) {
        this.clearMarkers();
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {
                // let position = {
                //     lat: results[0].geometry.location.lat,
                //     lng: results[0].geometry.location.lng
                // };
                const marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                });
                this.markers.push(marker);
                map.setCenter(results[0].geometry.location);
            }
        });
    }

    public clearMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            console.log(this.markers[i]);
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }

    public startNavigation(map, panel) {

        const directionsService = new google.maps.DirectionsService;
        const directionsDisplay = new google.maps.DirectionsRenderer;

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(panel.nativeElement);

        directionsService.route({
            origin: {lat: 50.927860, lng: 6.927865},
            destination: {lat: 50.941357, lng: 6.958307},
            travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }

        });
    }


}
