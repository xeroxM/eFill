import {ElementRef, Injectable, NgZone, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DataImportService} from '../data-import/data-import.service';
import * as MarkerClusterer from '@google/markerclustererplus';
import {MapStyleService} from '../map-style/map-style.service';
import {NavController} from '@ionic/angular';
import {Test} from 'tslint';

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
    public stationInformation = [];
    public currentWindow = null;
    public markerCluster: any;

    public directionsService: any;
    public directionsDisplay: any;

    public mcOptions = {
        styles: this.mapStyleService.clusterStyles,
    };

    constructor(
        public navCtrl: NavController,
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
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        window['getRouteToStation'] = (stationlat, stationlong) => {
            this.getRouteToStation(stationlat, stationlong);
        };
    }

    public getCurrentLocation() {
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
            this.map.setZoom(14);
        });
    }

    public getInput(autocomplete){
        autocomplete.input = 'Mein Standort';
        this.geolocation.getCurrentPosition().then( pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
        });
    }

    public loadStationLocations() {
        this.importData.getCoordinates().subscribe(data => {
            this.stationInformation = data;
            for (let i = 0; i < this.stationInformation.length; i++) {
                const location = new google.maps.LatLng(this.stationInformation[i].lat, this.stationInformation[i].long);
                const marker = this.addMarker(location, this.map);

                this.stationMarkers.push(marker);

                marker.addListener('click', () => {
                    if (this.currentWindow != null) {
                        this.currentWindow.close();
                    }
                    const peter = `this.getRouteToStation(this.stationInformation[${i}].lat, this.stationInformation[${i}].long)`;
                    const infowindow = new google.maps.InfoWindow({
                        content:
                            `<div>${this.stationInformation[i].operator}</div><br/>` +
                            `<a href="javascript:this.getRouteToStation(${this.stationInformation[i].lat}, ${this.stationInformation[i].long});">Route berechnen</a>`
                    });

                    infowindow.open(this.map, marker);
                    this.currentWindow = infowindow;
                    // this.getRouteToStation(this.stationInformation[i].lat, this.stationInformation[i].long);

                });
            }
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptions);
        });
    }

    public clickTest(event: any) {
        console.log(event);
    }


    public updateSearchResults(autocomplete) {
        if (autocomplete.input === null) {
            this.autocompleteItems = [];
            return;
        }

        this.GoogleAutocomplete.getPlacePredictions({input: autocomplete.input, componentRestrictions: {country: 'de'}},
            (predictions, status) => {
                if (predictions) {
                    this.zone.run(() => {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction);
                        });
                    });
                }
            });
    }

    public selectSearchResult(item, autocomplete) {
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {

                if (autocomplete === this.autocompletePlaceSearch) {
                    this.map.setCenter(results[0].geometry.location);
                    this.map.setZoom(13);
                }
                autocomplete.input = results[0].formatted_address;
            }
        });
    }

    public startNavigation(originlat, originlong, destinationlat, destinationlong) {
        let start, end;
        if (originlong === null) {
            start = originlat;
        } else {
            start = {lat:  originlat, lng: originlong};
        }
        if (destinationlong === null) {
            end = destinationlat;
        } else {
            end = {lat: destinationlat, lng: destinationlong};
        }
        const request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode['DRIVING']
        };
        this.directionsService.route(request, (res, status) => {

            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setMap(this.map);
                this.directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }

        });
    }

    public getRouteToStation(stationlat, stationlong) {
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.startNavigation(this.geoLocLat, this.geoLocLong,
                stationlat, stationlong);
        });
    }

    public convertObj(origin, destination) {
        let originlat, originlong, destinationlat, destinationlong;
        this.geolocation.getCurrentPosition().then( pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
        });
        const originStr = JSON.stringify(origin);
        const originSub = originStr.substring(10);
        const originReg = originSub.search('\"');
        originlat = originSub.substring(0, originReg);
        const destinationStr = JSON.stringify(destination);
        const destinationSub = destinationStr.substring(10);
        const destinationReg = destinationSub.search('\"');
        destinationlat = destinationSub.substring(0, destinationReg);
        if (originlat === 'Mein Standort') {
            originlat = this.geoLocLat;
            originlong = this.geoLocLong;
            destinationlong = null;
        } else if (destinationlat === 'Mein Standort') {
            destinationlat = this.geoLocLat;
            destinationlong = this.geoLocLong;
            originlong = null;
        } else {
            originlong = null;
            destinationlong = null;
        }
        console.log(originlat + ' ' + originlong + ' ' + destinationlat + ' ' + destinationlong);
        this.navCtrl.navigateForward('/tabs/(map:map)');
        this.startNavigation(originlat, originlong, destinationlat, destinationlong);

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
