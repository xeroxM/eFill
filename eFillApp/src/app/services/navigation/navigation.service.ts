import {Injectable, NgZone} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DataImportService} from '../data-import/data-import.service';
import * as MarkerClusterer from '@google/markerclustererplus';
import {MapStyleService} from '../map-style/map-style.service';
import {NavController} from '@ionic/angular';
import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

declare let google: any;

@Injectable({
    providedIn: 'root'
})

export class NavigationService {

    public map: any;

    public markers: any;
    public geocoder: any;
    public GooglePlaces: any;

    public GoogleAutocomplete: any;
    public autocompleteItems: any;
    public autocompletePlaceSearch: any;
    public autocompleteStartPoint: any;
    public autocompleteWayPoint: any;
    public autocompleteEndPoint: any;
    public showItemsPlaceSearch = true;
    public showItemsStartPoint = true;
    public showItemsWayPoint = true;
    public showItemsEndPoint = true;

    public stationMarkersSet = new Set();
    public stationMarkers = [];
    public stationInformation = [];
    public currentWindow = null;
    public markerCluster: any;
    public geoLocLat: number;
    public geoLocLong: number;

    public favorites = [];

    public directionsService: any;
    public directionsDisplay: any;

    public isNight: boolean;
    public isNightToggle: boolean;

    public mcOptionsNight = {
        styles: this.mapStyleService.clusterStylesNight,
        maxZoom: 17
    };

    public mcOptionsDay = {
        styles: this.mapStyleService.clusterStylesDay,
        maxZoom: 17
    };

    public routeForm: FormGroup;
    public wayPointObject: Validators = {
        way_point_address: ''
    };

    constructor(
        public navCtrl: NavController,
        public geolocation: Geolocation,
        public zone: NgZone,
        public importData: DataImportService,
        public mapStyleService: MapStyleService,
        public fb: FormBuilder) {
        this.geocoder = new google.maps.Geocoder;
        const elem = document.createElement('div');
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocompletePlaceSearch = {input: ''};
        this.autocompleteStartPoint = {input: ''};
        this.autocompleteWayPoint = {input: ''};
        this.autocompleteEndPoint = {input: ''};
        this.autocompleteItems = [];
        this.markers = [];
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        window['getRouteToStation'] = (stationlat, stationlong) => {
            this.getRouteToStation(stationlat, stationlong);
        };

        this.createRouteForm();
    }

    public getCurrentLocation() {
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
            this.map.setZoom(15);
        });
    }

    public getInput(autocomplete) {
        autocomplete.input = 'Mein Standort';
        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
        });
    }

    public loadStationLocations() {
        this.importData.getCoordinates().subscribe(data => {
            this.stationInformation = data;

            const optionsSpidifier = {
                keepSpiderfied: true,
                legWeight: 0,
                nudgeRadius: 1,
                spiderfiedShadowColor: false
            };

            const markerSpiderfier = new OverlappingMarkerSpiderfier(this.map, optionsSpidifier);

            for (let i = 0; i < this.stationInformation.length; i++) {
                const location = new google.maps.LatLng(this.stationInformation[i].lat, this.stationInformation[i].long);
                const marker = this.addMarker(location, this.map);

                this.stationMarkersSet.add(marker);
                markerSpiderfier.addMarker(marker);

                this.stationMarkers = Array.from(this.stationMarkersSet);

                marker.addListener('click', () => {
                    if (this.currentWindow != null) {
                        this.currentWindow.close();
                    }

                    const infowindow = new google.maps.InfoWindow({
                        maxWidth: 320,
                        maxHeight: 320,
                        content:
                            `<div>${this.stationInformation[i].operator}</div><br/>` +
                            `<a href="javascript:this.getRouteToStation(${this.stationInformation[i].lat}, ${this.stationInformation[i].long});">Route berechnen</a>` +
                            `<button id="isNotFavorite" style="background: none; position: absolute; right: 11px; bottom: 0">` +
                            `<ion-icon name="star-outline" style="font-size: 19px; color: #868e96"></ion-icon></button>` +
                            `<button id="isFavorite" style="background: none; position: absolute; right: 11px; bottom: 0">` +
                            `<ion-icon name="star" style="font-size: 19px; color: #007bff"></ion-icon></button>`
                    });

                    google.maps.event.addListenerOnce(infowindow, 'domready', () => {

                        const result = this.favorites.find(station => station === this.stationInformation[i]);

                        if (this.favorites.length === 0) {
                            document.getElementById('isFavorite').style.visibility = 'hidden';
                        } else {
                            if (result) {
                                document.getElementById('isNotFavorite').style.visibility = 'hidden';
                                document.getElementById('isFavorite').style.visibility = 'visible';
                            } else {
                                document.getElementById('isFavorite').style.visibility = 'hidden';
                                document.getElementById('isNotFavorite').style.visibility = 'visible';
                            }
                        }

                        document.getElementById('isNotFavorite').addEventListener('click', () => {
                            console.log(this.favorites);
                            this.favorites.push(this.stationInformation[i]);
                            document.getElementById('isNotFavorite').style.visibility = 'hidden';
                            document.getElementById('isFavorite').style.visibility = 'visible';
                        });
                        document.getElementById('isFavorite').addEventListener('click', () => {
                            for (let j = 0; j < this.favorites.length; j++) {
                                if (this.favorites[j] === this.stationInformation[i]) {
                                    this.favorites.splice(j, 1);
                                }
                            }
                            document.getElementById('isFavorite').style.visibility = 'hidden';
                            document.getElementById('isNotFavorite').style.visibility = 'visible';
                        });
                    });

                    infowindow.open(this.map, marker);
                    this.currentWindow = infowindow;
                    // this.getRouteToStation(this.stationInformation[i].lat, this.stationInformation[i].long);

                });
            }

            const time = new Date().getHours();

            if (time < 6 || time > 19) {
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
            } else if (time >= 6 || time <= 19) {
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);
            }
        });
    }

    public updateSearchResults(autocomplete) {
        if (autocomplete.input === null) {
            this.autocompleteItems = [];
            return;
        }

        this.GoogleAutocomplete.getPlacePredictions({input: autocomplete.input, componentRestrictions: {country: 'de'}},
            (predictions) => {
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

    public selectSearchResult(item, autocomplete) {
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {

                if (autocomplete === this.autocompletePlaceSearch) {
                    this.map.setCenter(results[0].geometry.location);
                    this.map.setZoom(13);
                }

                this.zone.run(() => {
                    autocomplete.input = results[0].formatted_address;
                });
            }
        });

        console.log(this.routeForm);
    }

    public startNavigation(originlat, originlong, destinationlat, destinationlong, waypoint) {
        let start, end;

        if (originlong === null) {
            start = originlat;
        } else {
            start = {lat: originlat, lng: originlong};
        }
        if (destinationlong === null) {
            end = destinationlat;
        } else {
            end = {lat: destinationlat, lng: destinationlong};
        }

        const waypts = [];
        for (let i = 0; i < waypoint.length; i++) {
            waypts.push({
                location: waypoint[i]['way_point_address'],
                stopover: true
            });
        }

        const request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: true,
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
                stationlat, stationlong, []);
        });
    }

    public createRouteForm() {
        this.routeForm = this.fb.group({
            start_point: ['', Validators.required],
            way_point: this.fb.array([]),
            end_point: ['', Validators.required]
        });
    }

    get wayPointArray() {
        return this.routeForm.get('way_point') as FormArray;
    }

    public addWaypoints() {
        const newInstance = this.fb.group({...this.wayPointObject});
        this.wayPointArray.push(newInstance);
    }

    public removeWaypoint(index) {
        this.wayPointArray.removeAt(index);
    }

    public convertObj(origin, destination, waypoint) {
        let originlat, originlong, destinationlat, destinationlong;

        this.geolocation.getCurrentPosition().then(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
        });

        originlat = origin;
        destinationlat = destination;

        if (originlat === 'Mein Standort') {
            originlat = this.geoLocLat;
            originlong = this.geoLocLong;
            destinationlong = null;
        } else {
            originlong = null;
            destinationlong = null;
        }

        this.navCtrl.navigateBack('/tabs/(map:map)');
        this.startNavigation(originlat, originlong, destinationlat, destinationlong, waypoint);
    }

    public addMarker(position, map) {
        return new google.maps.Marker({
            position, map,
            icon: 'assets/icon/charging.png'
        });
    }

    public clearMarkers() {
        for (let i = 0; i < this.stationMarkers.length; i++) {
            this.stationMarkers[i].setMap(null);
        }
        this.stationMarkers = [];
    }

    public selectFavorite(favorite) {
        this.map.setCenter(new google.maps.LatLng(favorite['lat'], favorite['long']));
        this.map.setZoom(17);
        this.navCtrl.navigateBack('/tabs/(map:map)');
    }

    public changeMapStyle() {
        if (this.isNight) {
            this.isNight = false;
            this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
            this.map.setMapTypeId('day_map');
            this.markerCluster.clearMarkers();
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);

        } else if (!this.isNight) {
            this.isNight = true;
            this.map.mapTypes.set('night_map', this.mapStyleService.mapStyleNight);
            this.map.setMapTypeId('night_map');
            this.markerCluster.clearMarkers();
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);

        }
    }
}
