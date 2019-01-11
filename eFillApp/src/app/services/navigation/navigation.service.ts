import {Injectable, NgZone} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DataImportService} from '../data-import/data-import.service';
import * as MarkerClusterer from '@google/markerclustererplus';
import {MapStyleService} from '../map-style/map-style.service';

declare let google: any;

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    public geoLocLat: number;
    public geoLocLong: number;

    public map: any;

    public markers: any;
    public geocoder: any;
    public GooglePlaces: any;
    public autocompletePlaceSearch: any;
    public autocompleteStartPoint: any;
    public autocompleteEndPoint: any;
    public showItemsPlaceSearch = true;
    public showItemsStartPoint = true;
    public showItemsEndPoint = true;
    public GoogleAutocomplete: any;
    public autocompleteItems: any;

    public stationMarkers = [];
    public coords = [];
    public markerCluster: any;

    public mcOptions = {
        styles: this.mapStyleService.clusterStyles,
    };

    constructor(
        public geolocation: Geolocation,
        public zone: NgZone,
        public importData: DataImportService,
        public mapStyleService: MapStyleService) {
        this.geocoder = new google.maps.Geocoder;
        const elem = document.createElement('div');
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocompletePlaceSearch = {input: ''};
        this.autocompleteStartPoint = {input: ''};
        this.autocompleteEndPoint = {input: ''};
        this.autocompleteItems = [];
        this.markers = [];
    }

    public getCurrentLocation() {
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
            this.map.setZoom(14);
        });
    }

    public loadStationLocations() {
        this.importData.getCoordinates().subscribe(data => {
            this.coords = data;
            for (let i = 0; i < this.coords.length; i++) {
                const location = new google.maps.LatLng(this.coords[i].lat, this.coords[i].long);
                const marker = this.addMarker(location, this.map);
                this.stationMarkers.push(marker);
            }
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptions);
        });
    }

    public updateSearchResults(autocomplete) {
        if (autocomplete.input === null) {
            this.autocompleteItems = [];
            return;
        }

        this.GoogleAutocomplete.getPlacePredictions({input: autocomplete.input, componentRestrictions: {country: 'de'}},
            (predictions, status) => {
                this.autocompleteItems = [];
                if (predictions) {
                    this.zone.run(() => {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction);
                            /*if (this.autocompleteItems.length >= 5) {
                                this.autocompleteItems.slice(0, 5);
                            }*/
                        });
                    });
                }
            });
    }

    public selectSearchResult(item, autocomplete) {
        this.clearMarkers();
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {

                if (autocomplete === this.autocompletePlaceSearch) {
                    // let position = {
                    //     lat: results[0].geometry.location.lat,
                    //     lng: results[0].geometry.location.lng
                    // };
                    const marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: this.map
                    });
                    this.markers.push(marker);
                    this.map.setCenter(results[0].geometry.location);
                }
                autocomplete.input = results[0].formatted_address;
            }
        });
    }

    public startNavigation(panel) {

        const directionsService = new google.maps.DirectionsService;
        const directionsDisplay = new google.maps.DirectionsRenderer;

        directionsDisplay.setMap(this.map);
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

    public addMarker(position, map) {
        return new google.maps.Marker({
            position, map,
            icon: 'assets/icon/charging.png'
        });
    }

    public clearMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            console.log(this.markers[i]);
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }

}
