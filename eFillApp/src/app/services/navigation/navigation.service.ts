import {Injectable, NgZone} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DataImportService} from '../data-import/data-import.service';
import * as MarkerClusterer from '@google/markerclustererplus';
import {MapStyleService} from '../map-style/map-style.service';
import {NavController} from '@ionic/angular';
import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Platform} from '@ionic/angular';
import {TextToSpeechService} from '../text-to-speech/text-to-speech.service';

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

    // array which contains the items for autocompletion list
    public autocompleteItems = [];

    // ngModel variables to determin what user typed into input field
    public autocompletePlaceSearch: any;
    public autocompleteStartPoint: any;
    public autocompleteEndPoint: any;

    // determines which autocomplete-list is shown
    public showItemsPlaceSearch = true;
    public showItemsStartPoint = true;
    public showItemsWayPoint = true;
    public showItemsEndPoint = true;

    // arrays for markers of e-Charging-Stations
    public stationMarkersSet = new Set();
    public stationMarkers = [];

    public stationDistance = [];

    // array for station information from server
    public stationInformation = [];
    public stationInformationExtended = [];
    public currentWindow = null;

    // determines markerClusterer
    public markerCluster: any;
    public markersShown = true;

    // Observable to .subscribe or .unsubscribe for geolocation
    public watchID: any;

    // array for favorites
    public favorites = [];

    public directionsService: any;
    public directionsDisplay: any;
    public currentDirections: any;
    public lastStep = [];

    public routeToStation = true;

    // array for all steps of route calculated
    public routeOverview = {};
    public routeObjects = [];
    public routeActive = false;
    public routeStepIndex = 0;
    public navigationActive = false;
    public volumeOn = true;

    // markers for geolocation
    public markerInner: any;
    public markerOuter: any;

    // lat and long for geolocation
    public geoLocLat: number;
    public geoLocLong: number;
    public locationOptions = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    };

    // checks if its day or night
    public isNight: boolean;
    public isNightToggle: boolean;

    // options for nightMap Clusters
    public mcOptionsNight = {
        styles: this.mapStyleService.clusterStylesNight,
        maxZoom: 17
    };

    // options for dayMap Clusters
    public mcOptionsDay = {
        styles: this.mapStyleService.clusterStylesDay,
        maxZoom: 17
    };

    // form Group for route calculation
    public routeForm: FormGroup;

    // object for added waypoint
    public wayPointObject: Validators = {
        way_point_address: ['', Validators.required]
    };

    // routeForm elements
    public plug_schuko = true;
    public plug_cee_blue = true;
    public plug_cee_red = true;
    public plug_type1 = true;
    public plug_type2 = true;
    public plug_ccs = true;
    public plug_chademo = true;
    public station_fast = true;
    public station_normal = true;

    public routeParameters;

    // circles which show reach
    public greenCircle;
    public yellowCircle;
    public redCircle;

    constructor(
        public navCtrl: NavController,
        public geolocation: Geolocation,
        public zone: NgZone,
        public dataImport: DataImportService,
        public mapStyleService: MapStyleService,
        public fb: FormBuilder,
        private platform: Platform,
        public tts: TextToSpeechService) {

        this.platform.ready().then(() => {
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
        });
    }

    public getCurrentLocation() {
        this.markerInner = new google.maps.Marker({
            map: this.map,
            icon: this.mapStyleService.innerCircle
        });

        this.markerOuter = new google.maps.Marker({
            map: this.map,
            icon: this.mapStyleService.outerCircle
        });

        let isZoomed = false;

        this.watchID = this.geolocation.watchPosition(this.locationOptions).subscribe(pos => {

            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;

            if (!isZoomed) {
                this.map.setZoom(15);
                this.map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
                isZoomed = true;
            }

            const location = new google.maps.LatLng(this.geoLocLat, this.geoLocLong);
            this.markerInner.setPosition(location);
            this.markerOuter.setPosition(location);
        });
    }

    public getInput(autocomplete) {
        autocomplete.input = 'Mein Standort';
        this.watchID = this.geolocation.watchPosition(this.locationOptions).subscribe(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.watchID.unsubscribe();
        });
    }

    public async loadStationLocations() {
        this.routeParameters = await this.dataImport.getRouteParameters();
        this.favorites = await this.dataImport.getAllFavEntries();
        this.stationInformation = await this.dataImport.getAllDBEntries();

        await this.dataImport.getAllDBEntries().then(() => {
                this.mapStyleService.showSplash = false;
            }
        );

        if (this.routeParameters[0]) {
            this.plug_schuko = this.routeParameters[0]['plug_schuko'].toLowerCase() === 'true';
            this.plug_cee_blue = this.routeParameters[0]['plug_cee_blue'].toLowerCase() === 'true';
            this.plug_cee_red = this.routeParameters[0]['plug_cee_red'].toLowerCase() === 'true';
            this.plug_type1 = this.routeParameters[0]['plug_type1'].toLowerCase() === 'true';
            this.plug_type2 = this.routeParameters[0]['plug_type2'].toLowerCase() === 'true';
            this.plug_ccs = this.routeParameters[0]['plug_ccs'].toLowerCase() === 'true';
            this.plug_chademo = this.routeParameters[0]['plug_chademo'].toLowerCase() === 'true';
            this.station_fast = this.routeParameters[0]['station_fast'].toLowerCase() === 'true';
            this.station_normal = this.routeParameters[0]['station_normal'].toLowerCase() === 'true';
        }

        this.createRouteForm();

        const optionsSpidifier = {
            keepSpiderfied: true,
            legWeight: 0,
            nudgeRadius: 1,
            spiderfiedShadowColor: false
        };

        const markerSpiderfier = new OverlappingMarkerSpiderfier(this.map, optionsSpidifier);

        this.stationInformationExtended = this.stationInformation;

        for (let i = 0; i < this.stationInformation.length; i++) {
            let marker;

            const str = this.stationInformation[i]['plug_type_1'] + ', ' + this.stationInformation[i]['plug_type_2'] + ', ' +
                this.stationInformation[i]['plug_type_3'] + ', ' + this.stationInformation[i]['plug_type_4'];
            let partsOfStr = str.split(', ');
            partsOfStr = partsOfStr.filter((el) => {
                return el !== '';
            });

            partsOfStr = Array.from(new Set(partsOfStr));

            const location = new google.maps.LatLng(this.stationInformation[i].lat, this.stationInformation[i].long);

            if (this.stationInformation[i]['station_type'] === 'Schnellladeeinrichtung') {
                marker = this.addMarker(location, this.map,
                    {
                        url: 'assets/icon/charging_fast.png',
                        scaledSize: new google.maps.Size(30, 30)
                    }, this.stationInformation[i]['station_type'], partsOfStr, this.stationInformation[i]['operator'],
                    this.stationInformation[i]['adress'], this.stationInformation[i]['place']);
            } else {
                marker = this.addMarker(location, this.map,
                    {
                        url: 'assets/icon/charging.png',
                        scaledSize: new google.maps.Size(30, 30)
                    }, this.stationInformation[i]['station_type'], partsOfStr, this.stationInformation[i]['operator'],
                    this.stationInformation[i]['adress'], this.stationInformation[i]['place']);
            }

            this.stationInformationExtended[i]['plug_types'] = partsOfStr;
            this.stationMarkersSet.add(marker);
            markerSpiderfier.addMarker(marker);

            this.stationMarkers = Array.from(this.stationMarkersSet);

            this.addInfoWindow(marker, this.stationInformation[i]);
        }

        const time = new Date().getHours();

        if (time < 6 || time > 19) {
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
        } else if (time >= 6 || time <= 19) {
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);
        }
    }

    public updateSearchResults(autocomplete) {
        if (autocomplete.input === null || autocomplete.input.length === 0) {
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
    }

    public calculateRoute(originlat, originlong, destinationlat, destinationlong, waypoint) {
        let start, end;

        if (originlong === null) {
            start = originlat;
        } else {
            start = new google.maps.LatLng(originlat, originlong);
        }
        if (destinationlong === null) {
            end = destinationlat;
        } else {
            end = new google.maps.LatLng(destinationlat, destinationlong);
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
            travelMode: google.maps.TravelMode['DRIVING'],
        };

        this.currentDirections = request;
        if (this.markerInner && this.markerInner['visible'] === true) {
            this.markerInner.setMap(null);
            this.markerOuter.setMap(null);
            this.watchID.unsubscribe();
        }

        this.directionHandler(request);
        if (this.routeToStation === false) {
            this.routeFilter();
            this.calculateReach(this.routeForm.value['reach']);
        }
    }

    public directionHandler(request) {
        this.directionsService.route(request, (res, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setMap(this.map);
                this.markersShown = false;
                this.markerCluster.clearMarkers();
                this.directionsDisplay.setDirections(res);

                if (!this.isNight) {
                    this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);

                } else if (this.isNight) {
                    this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
                }
                this.markerCluster.clearMarkers();

                const htmlToPlaintext = (text) => {
                    return text ? String(text).replace(/(<([^>]+)>)/ig, '') : '';
                };

                if (res['routes'][0]['legs'].length === 1) {
                    this.routeOverview = {
                        duration: res['routes'][0]['legs'][0]['duration'],
                        distance: res['routes'][0]['legs'][0]['distance'],
                        start_address: res['routes'][0]['legs'][0]['start_address'],
                        end_address: res['routes'][0]['legs'][0]['end_address']
                    };

                    for (let i = 0; i < res['routes'][0]['legs'][0]['steps'].length; i++) {
                        const routeObject = {};
                        routeObject['startLat'] = res['routes'][0]['legs'][0]['steps'][i]['start_point']['lat']();
                        routeObject['startLng'] = res['routes'][0]['legs'][0]['steps'][i]['start_point']['lng']();
                        routeObject['endLat'] = res['routes'][0]['legs'][0]['steps'][i]['end_point']['lat']();
                        routeObject['endLng'] = res['routes'][0]['legs'][0]['steps'][i]['end_point']['lng']();
                        routeObject['duration'] = {
                            text: res['routes'][0]['legs'][0]['steps'][i]['duration']['text'],
                            value: res['routes'][0]['legs'][0]['steps'][i]['duration']['value']
                        };
                        routeObject['distance'] = {
                            text: res['routes'][0]['legs'][0]['steps'][i]['distance']['text'],
                            value: res['routes'][0]['legs'][0]['steps'][i]['distance']['value']
                        };
                        routeObject['maneuver'] = res['routes'][0]['legs'][0]['steps'][i]['maneuver'];
                        routeObject['instructions'] = res['routes'][0]['legs'][0]['steps'][i]['instructions'];
                        routeObject['speech'] = htmlToPlaintext(res['routes'][0]['legs'][0]['steps'][i]['instructions']);

                        this.routeObjects.push(routeObject);
                    }
                } else {

                    this.routeOverview = {
                        duration: {},
                        distance: {},
                        start_address: res['routes'][0]['legs'][0]['start_address'],
                        end_address: res['routes'][0]['legs'][res['routes'][0]['legs'].length - 1]['end_address']
                    };

                    let distance = 0;
                    let duration = 0;

                    for (let i = 0; i < res['routes'][0]['legs'].length; i++) {
                        distance = distance + res['routes'][0]['legs'][i]['distance']['value'];
                        duration = duration + res['routes'][0]['legs'][i]['duration']['value'];
                    }

                    this.routeOverview['distance']['value'] = distance;
                    this.routeOverview['duration']['value'] = duration;
                    this.routeOverview['distance']['text'] = (Math.round((distance / 1000) * 10) / 10).toString() + ' km';

                    const transformDuration = () => {
                        let durationText;
                        let remainder;

                        if ((duration / 60) > 60) {
                            if (((duration / 60) / 60) < 2) {
                                remainder = (duration / 60) % 60;
                                durationText = (((duration / 60) / 60).toString()).substring(0, ((duration / 60) / 60)
                                        .toString().indexOf('.')) + ' hour ' +
                                    (remainder.toString()).substring(0, remainder.toString().indexOf('.')) + ' mins';
                            } else {
                                remainder = (duration / 60) % 60;
                                durationText = (((duration / 60) / 60).toString()).substring(0, ((duration / 60) / 60)
                                        .toString().indexOf('.')) + ' hours ' +
                                    (remainder.toString()).substring(0, remainder.toString().indexOf('.')) + ' mins';
                            }
                        } else {
                            durationText = (duration / 60).toString() + ' mins';
                        }
                        this.routeOverview['duration']['text'] = durationText;
                    };

                    transformDuration();

                    let saveIndex;

                    for (let i = 0; i < res['routes'][0]['legs'].length; i++) {
                        this.lastStep.push(res['routes'][0]['legs'][i]['steps'][res['routes'][0]['legs'][i]['steps'].length - 1]);
                        for (let j = 0; j < res['routes'][0]['legs'][i]['steps'].length; j++) {
                            const routeObject = {};
                            routeObject['startLat'] = res['routes'][0]['legs'][i]['steps'][j]['start_point']['lat']();
                            routeObject['startLng'] = res['routes'][0]['legs'][i]['steps'][j]['start_point']['lng']();
                            routeObject['endLat'] = res['routes'][0]['legs'][i]['steps'][j]['end_point']['lat']();
                            routeObject['endLng'] = res['routes'][0]['legs'][i]['steps'][j]['end_point']['lng']();
                            routeObject['duration'] = {
                                text: res['routes'][0]['legs'][i]['steps'][j]['duration']['text'],
                                value: res['routes'][0]['legs'][i]['steps'][j]['duration']['value']
                            };
                            routeObject['distance'] = {
                                text: res['routes'][0]['legs'][i]['steps'][j]['distance']['text'],
                                value: res['routes'][0]['legs'][i]['steps'][j]['distance']['value']
                            };
                            routeObject['maneuver'] = res['routes'][0]['legs'][i]['steps'][j]['maneuver'];
                            routeObject['instructions'] = res['routes'][0]['legs'][i]['steps'][j]['instructions'];
                            routeObject['speech'] = htmlToPlaintext(res['routes'][0]['legs'][i]['steps'][j]['instructions']);

                            this.routeOverview['index'] = i;
                            this.routeObjects.push(routeObject);
                            saveIndex = i;
                        }
                    }
                }

                this.routeActive = true;

            } else {
                console.warn(status);
            }
        });
    }

    public cancelRoute() {
        const location = new google.maps.LatLng(51.133481, 10.018343);
        this.directionsDisplay.setMap(null);
        if (this.routeToStation === false) {
            this.greenCircle.setMap(null);
            this.yellowCircle.setMap(null);
            this.redCircle.setMap(null);
        }
        this.routeToStation = true;
        this.map.setCenter(location);
        this.map.setZoom(5.4);
        this.routeActive = false;
        this.navigationActive = false;
        this.routeForm.get('start_point').setValue('');
        this.autocompleteStartPoint.input = '';
        this.routeForm.get('end_point').setValue('');
        this.autocompleteEndPoint.input = '';
        this.currentDirections = null;
        while (this.wayPointArray.length !== 0) {
            this.wayPointArray.removeAt(0);
        }

        this.markerCluster.clearMarkers();
        this.markersShown = false;
        this.stationMarkers = Array.from(this.stationMarkersSet);
        this.showAndHideMarkers();
    }

    public startNavigation() {
        this.navigationActive = true;
        this.routeStepIndex = 0;

        const options = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };

        this.markerInner = new google.maps.Marker({
            map: this.map,
            icon: this.mapStyleService.innerCircle
        });

        this.markerOuter = new google.maps.Marker({
            map: this.map,
            icon: this.mapStyleService.outerCircle
        });

        if (this.routeStepIndex === 0 && this.volumeOn) {
            this.tts.directionsTextToSpeech(this.routeObjects[0]['speech']);
        }

        let isZoomed = false;

        this.watchID = this.geolocation.watchPosition(options).subscribe(pos => {

            if (!isZoomed) {
                this.map.setZoom(15);
                isZoomed = true;
            }

            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.map.setCenter(new google.maps.LatLng(this.geoLocLat, this.geoLocLong));
            const location = new google.maps.LatLng(this.geoLocLat, this.geoLocLong);
            this.markerInner.setPosition(location);
            this.markerOuter.setPosition(location);

            // Haversine formula to calculate distance between geolocation and next route point
            const rad = (x) => {
                return x * Math.PI / 180;
            };

            const earthRadius = 6378137;
            const distanceLat = rad(this.routeObjects[this.routeStepIndex]['endLat'] - this.geoLocLat);
            const distanceLong = rad(this.routeObjects[this.routeStepIndex]['endLng'] - this.geoLocLong);
            const a = Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
                Math.cos(rad(this.geoLocLat)) * Math.cos(rad(this.routeObjects[this.routeStepIndex]['endLat'])) *
                Math.sin(distanceLong / 2) * Math.sin(distanceLong / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = earthRadius * c;

            if (distance < 50) {
                this.routeStepIndex = this.routeStepIndex + 1;
                if (this.lastStep[0] &&
                    this.lastStep[0]['end_point']['lat']() === this.routeObjects[this.routeStepIndex]['endLat'] &&
                    this.lastStep[0]['end_point']['lng']() === this.routeObjects[this.routeStepIndex]['endLng']) {
                    this.lastStep.shift();
                    this.currentDirections['waypoints'].shift();
                }
                if (this.volumeOn) {
                    this.tts.directionsTextToSpeech(this.routeObjects[this.routeStepIndex]['speech']);
                }
            }

        });
    }

    public showNearbyLoadingStations() {

        for (let i = 0; this.stationMarkers.length > i; i++) {
            const rad = (x) => {
                return x * Math.PI / 180;
            };

            const earthRadius = 6378137;
            const distanceLat = rad(this.stationMarkers[i]['position']['lat']() - this.geoLocLat);
            const distanceLong = rad(this.stationMarkers[i]['position']['lng']() - this.geoLocLong);
            const a = Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
                Math.cos(rad(this.geoLocLat)) * Math.cos(rad(this.stationMarkers[i]['position']['lat']())) *
                Math.sin(distanceLong / 2) * Math.sin(distanceLong / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = earthRadius * c;

            this.stationDistance.push(this.stationMarkers[i]);
            this.stationDistance[i].distance = distance;
        }

        this.stationDistance.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
        this.stationDistance = this.stationDistance.slice(0, 20);

        for (let i = 0; this.stationDistance.length > i; i++) {
            const request = {
                origin: {lat: this.geoLocLat, lng: this.geoLocLong},
                destination: new google.maps.LatLng(this.stationDistance[i]['position']['lat'](),
                    this.stationDistance[i]['position']['lng']()),
                travelMode: google.maps.TravelMode['DRIVING'],
            };

            this.directionsService.route(request, (res, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.directionsDisplay.setDirections(res);

                    this.stationDistance[i]['distance_text'] = res['routes'][0]['legs'][0]['distance']['text'];
                    this.stationDistance[i]['distance_value'] = Number(res['routes'][0]['legs'][0]['distance']['value']);
                    this.stationDistance[i]['duration_text'] = res['routes'][0]['legs'][0]['duration']['text'];
                    this.stationDistance[i]['duration_value'] = Number(res['routes'][0]['legs'][0]['duration']['text']);
                }
            });
        }

        this.stationDistance.sort((a, b) => parseFloat(a['duration_value']) - parseFloat(b['duration_value']));

        this.stationDistance = this.stationDistance.slice(0, 10);
        this.navCtrl.navigateForward('/tabs/(map:nearby-stations)');
        this.map.setZoom(15);
    }

    public cancelNavigation() {
        this.currentDirections = null;
        this.markerInner.setMap(null);
        this.markerOuter.setMap(null);
        this.watchID.unsubscribe();
        this.cancelRoute();
    }

    public getRouteToStation(stationlat, stationlong) {
        this.watchID = this.geolocation.watchPosition(this.locationOptions).subscribe(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.calculateRoute(this.geoLocLat, this.geoLocLong,
                stationlat, stationlong, []);
            this.watchID.unsubscribe();
        });
    }

    public updateRoute(selectedStation) {
        const stationObject = {
            location: new google.maps.LatLng(selectedStation['position']['lat'](), selectedStation['position']['lng']()),
            stopover: true
        };

        this.currentDirections['origin'] = {lat: this.geoLocLat, lng: this.geoLocLong};
        this.currentDirections['waypoints'].unshift(stationObject);
        this.directionsDisplay.setMap(null);
        this.directionHandler(this.currentDirections);
        this.markerInner.setMap(null);
        this.markerOuter.setMap(null);
        this.watchID.unsubscribe();
        this.startNavigation();
        this.stationDistance = [];
        this.navCtrl.navigateBack('/tabs/(map:map)');
        this.map.setZoom(15);
    }

    public createRouteForm() {
        this.routeForm = this.fb.group({
            start_point: ['', Validators.required],
            way_point: this.fb.array([]),
            end_point: ['', Validators.required],
            reach: ['', Validators.required],
            temperature: ['usual', Validators.required],
            driving_style: ['normal', Validators.required],
            plug_schuko: [this.plug_schuko, Validators.required],
            plug_cee_blue: [this.plug_cee_blue, Validators.required],
            plug_cee_red: [this.plug_cee_red, Validators.required],
            plug_type1: [this.plug_type1, Validators.required],
            plug_type2: [this.plug_type2, Validators.required],
            plug_ccs: [this.plug_ccs, Validators.required],
            plug_chademo: [this.plug_chademo, Validators.required],
            station_normal: [this.station_normal, Validators.required],
            station_fast: [this.station_fast, Validators.required]
        });

        this.routeForm.controls['plug_schuko'].setValue(this.plug_schuko);
        this.routeForm.controls['plug_cee_blue'].setValue(this.plug_cee_blue);
        this.routeForm.controls['plug_cee_red'].setValue(this.plug_cee_red);
        this.routeForm.controls['plug_type1'].setValue(this.plug_type1);
        this.routeForm.controls['plug_type2'].setValue(this.plug_type2);
        this.routeForm.controls['plug_ccs'].setValue(this.plug_ccs);
        this.routeForm.controls['plug_chademo'].setValue(this.plug_chademo);
        this.routeForm.controls['station_normal'].setValue(this.station_normal);
        this.routeForm.controls['station_fast'].setValue(this.station_fast);
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

    public async convertObj(origin, destination, waypoint) {
        let originlat, originlong, destinationlat, destinationlong;

        this.watchID = this.geolocation.watchPosition(this.locationOptions).subscribe(pos => {
            this.geoLocLat = pos.coords.latitude;
            this.geoLocLong = pos.coords.longitude;
            this.watchID.unsubscribe();
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
        this.calculateRoute(originlat, originlong, destinationlat, destinationlong, waypoint);
    }

    public getDirections() {
        if ((document.getElementById('directionsPanel').style.display) === 'none') {
            document.getElementById('directionsPanel').style.display = 'block';
        } else {
            document.getElementById('directionsPanel').style.display = 'none';
        }
    }

    public addMarker(position, map, iconstyle, station_type, plug_types, operator, adress, place) {
        const marker = new google.maps.Marker({
            position, map,
            icon: iconstyle
        });

        marker['station_type'] = station_type;
        marker['plug_types'] = plug_types;
        marker['operator'] = operator;
        marker['adress'] = adress;
        marker['place'] = place;

        return marker;
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

    public showAndHideMarkers() {
        if (this.markersShown) {
            this.markersShown = false;
            this.markerCluster.clearMarkers();
        } else {
            this.markersShown = true;
            if (!this.isNight) {
                this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
                this.map.setMapTypeId('day_map');
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);

            } else if (this.isNight) {
                this.map.mapTypes.set('night_map', this.mapStyleService.mapStyleNight);
                this.map.setMapTypeId('night_map');
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
            }
        }
    }

    public filterStations(filter: boolean, element: string, info: string) {
        this.markerCluster.clearMarkers();
        if (!filter) {
            for (let i = 0; i < this.stationInformation.length; i++) {
                if (this.stationInformation[i][element] === info) {
                    const index = this.stationMarkers.indexOf(this.stationMarkers.find(
                        station => station[element] === this.stationInformation[i][element]));
                    if (index > -1) {
                        this.stationMarkers.splice(index, 1);
                    }
                }
            }
        } else {
            for (let i = 0; i < this.stationInformation.length; i++) {
                if (this.stationInformation[i][element] === info) {
                    let marker;
                    const location = new google.maps.LatLng(this.stationInformation[i].lat, this.stationInformation[i].long);

                    const str = this.stationInformation[i]['plug_type_1'] + ', ' + this.stationInformation[i]['plug_type_2'] + ', ' +
                        this.stationInformation[i]['plug_type_3'] + ', ' + this.stationInformation[i]['plug_type_4'];
                    let partsOfStr = str.split(', ');
                    partsOfStr = partsOfStr.filter((el) => {
                        return el !== '';
                    });

                    partsOfStr = Array.from(new Set(partsOfStr));

                    if (this.stationInformation[i]['station_type'] === 'Schnellladeeinrichtung') {
                        marker = this.addMarker(location, this.map,
                            {
                                url: 'assets/icon/charging_fast.png',
                                scaledSize: new google.maps.Size(30, 30)
                            }, this.stationInformation[i]['station_type'], partsOfStr, this.stationInformation[i]['operator'],
                            this.stationInformation[i]['adress'], this.stationInformation[i]['place']);
                    } else {
                        marker = this.addMarker(location, this.map,
                            {
                                url: 'assets/icon/charging.png',
                                scaledSize: new google.maps.Size(30, 30)
                            }, this.stationInformation[i]['station_type'], partsOfStr, this.stationInformation[i]['operator'],
                            this.stationInformation[i]['adress'], this.stationInformation[i]['place']);
                    }
                    marker.setMap(this.map);
                    this.stationMarkers.push(marker);

                    this.addInfoWindow(marker, this.stationInformation[i]);
                }
            }
        }
        if (!this.isNight) {
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);

        } else if (this.isNight) {
            this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
        }
    }

    public calculateReach(reach) {
        const reachOriginal = reach;
        let reachCalculatedGreen = reach;
        let reachCalculatedYellow = reach;
        let reachCalculatedRed = reach;

        // margin
        const marginGreen = (reachOriginal / 100) * 10;
        const marginYellow = (reachOriginal / 100) * 5;
        const marginRed = 0;

        // calculation of cold weather (under 10C°)
        const coldGreen = (reachOriginal / 100) * 40;
        const coldYellow = (reachOriginal / 100) * 26;
        const coldRed = (reachOriginal / 100) * 12;

        // calculation of normal weather (between 10 and 35 C°)
        const usualGreen = (reachOriginal / 100) * 10;
        const usualYellow = (reachOriginal / 100) * 5;
        const usualRed = 0;

        // calculation of hot weather (over 35C°)
        const hotGreen = (reachOriginal / 100) * 17;
        const hotYellow = (reachOriginal / 100) * 11;
        const hotRed = (reachOriginal / 100) * 5;

        // slow driving Style
        const slowGreen = 0;
        const slowYellow = 0;
        const slowRed = 0;

        // normal driving Style
        const normalGreen = (reachOriginal / 100) * 10;
        const normalYellow = (reachOriginal / 100) * 5;
        const normalRed = 0;

        // fast driving Style
        const fastGreen = (reachOriginal / 100) * 20;
        const fastYellow = (reachOriginal / 100) * 15;
        const fastRed = (reachOriginal / 100) * 10;

        if (this.routeForm.value['temperature'] === 'cold') {
            reachCalculatedGreen = reachCalculatedGreen - coldGreen;
            reachCalculatedYellow = reachCalculatedYellow - coldYellow;
            reachCalculatedRed = reachCalculatedRed - coldRed;
        } else if (this.routeForm.value['temperature'] === 'usual') {
            reachCalculatedGreen = reachCalculatedGreen - usualGreen;
            reachCalculatedYellow = reachCalculatedYellow - usualYellow;
            reachCalculatedRed = reachCalculatedRed - usualRed;
        } else {
            reachCalculatedGreen = reachCalculatedGreen - hotGreen;
            reachCalculatedYellow = reachCalculatedYellow - hotYellow;
            reachCalculatedRed = reachCalculatedRed - hotRed;
        }

        if (this.routeForm.value['driving_style'] === 'slow') {
            reachCalculatedGreen = reachCalculatedGreen - slowGreen;
            reachCalculatedYellow = reachCalculatedYellow - slowYellow;
            reachCalculatedRed = reachCalculatedRed - slowRed;
        } else if (this.routeForm.value['driving_style'] === 'normal') {
            reachCalculatedGreen = reachCalculatedGreen - normalGreen;
            reachCalculatedYellow = reachCalculatedYellow - normalYellow;
            reachCalculatedRed = reachCalculatedRed - normalRed;
        } else {
            reachCalculatedGreen = reachCalculatedGreen - fastGreen;
            reachCalculatedYellow = reachCalculatedYellow - fastYellow;
            reachCalculatedRed = reachCalculatedRed - fastRed;
        }

        reachCalculatedGreen = reachCalculatedGreen - marginGreen;
        reachCalculatedYellow = reachCalculatedYellow - marginYellow;
        reachCalculatedRed = reachCalculatedRed - marginRed;

        const drawCircle = (green, yellow, red, reachGreen, reachYellow, reachRed) => {
            const location = new google.maps.LatLng(this.geoLocLat, this.geoLocLong);
            this.redCircle = new google.maps.Circle({
                strokeColor: red,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: red,
                fillOpacity: 0.15,
                map: this.map,
                radius: reachRed * 1000
            });
            this.yellowCircle = new google.maps.Circle({
                strokeColor: yellow,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: yellow,
                fillOpacity: 0.15,
                map: this.map,
                radius: reachYellow * 1000
            });
            this.greenCircle = new google.maps.Circle({
                strokeColor: green,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: green,
                fillOpacity: 0.15,
                map: this.map,
                radius: reachGreen * 1000
            });

            this.redCircle.setCenter(location);
            this.yellowCircle.setCenter(location);
            this.greenCircle.setCenter(location);
        };

        drawCircle('#0F9D58', '#F4B400', '#DB4437', reachCalculatedGreen, reachCalculatedYellow, reachCalculatedRed);
    }

    public routeFilter() {
        this.stationMarkers = [];
        const stationMarkersSet = new Set();

        const addmarkers = (index) => {
            let marker;
            const location = new google.maps.LatLng(this.stationInformationExtended[index].lat,
                this.stationInformationExtended[index].long);

            if (this.stationInformationExtended[index]['station_type'] === 'Schnellladeeinrichtung') {
                marker = this.addMarker(location, this.map,
                    {
                        url: 'assets/icon/charging_fast.png',
                        scaledSize: new google.maps.Size(30, 30)
                    }, this.stationInformationExtended[index]['station_type'], this.stationInformationExtended[index]['plug_types'],
                    this.stationInformationExtended[index]['operator'], this.stationInformationExtended[index]['adress'],
                    this.stationInformationExtended[index]['place']);
            } else {
                marker = this.addMarker(location, this.map,
                    {
                        url: 'assets/icon/charging.png',
                        scaledSize: new google.maps.Size(30, 30)
                    }, this.stationInformationExtended[index]['station_type'], this.stationInformationExtended[index]['plug_types'],
                    this.stationInformationExtended[index]['operator'], this.stationInformationExtended[index]['adress'],
                    this.stationInformationExtended[index]['place']);
            }
            marker.setMap(this.map);
            this.addInfoWindow(marker, this.stationInformationExtended[index]);
            stationMarkersSet.add(marker);
        };

        for (let i = 0; i < this.stationInformationExtended.length; i++) {
            if (this.routeForm.value['plug_schuko'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'AC Schuko');
                if (result === 'AC Schuko') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_cee_blue'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'AC CEE 3 polig');
                if (result === 'AC CEE 3 polig') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_cee_red'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'AC CEE 5 polig');
                if (result === 'AC CEE 5 polig') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_type1'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'Steckdose Typ 1');
                if (result === 'Steckdose Typ 1') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_type2'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'AC Steckdose Typ 2');
                if (result === 'AC Steckdose Typ 2') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_type2'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'AC Kupplung Typ 2');
                if (result === 'AC Kupplung Typ 2') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_ccs'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'DC Kupplung Combo');
                if (result === 'DC Kupplung Combo') {
                    addmarkers(i);
                    continue;
                }
            }
            if (this.routeForm.value['plug_chademo'] === true) {
                const result = this.stationInformationExtended[i]['plug_types'].find(plug => plug === 'DC CHAdeMO');
                if (result === 'DC CHAdeMO') {
                    addmarkers(i);
                }
            }
        }

        this.stationMarkers = Array.from(stationMarkersSet);

        if (this.routeForm.value['station_normal'] === false) {
            this.stationMarkers.filter(station => {
                if (station['station_type'] === 'Normalladeeinrichtung') {
                    station.setMap(null);
                }
            });
            this.stationMarkers = this.stationMarkers.filter(station => station['station_type'] === 'Schnellladeeinrichtung');
        }
        if (this.routeForm.value['station_fast'] === false) {
            this.stationMarkers.filter(station => {
                if (station['station_type'] === 'Schnellladeeinrichtung') {
                    station.setMap(null);
                }
            });
            this.stationMarkers = this.stationMarkers.filter(station => station['station_type'] === 'Normalladeeinrichtung');
        }

        const saveFilterOptions = () => {
            this.dataImport.database.executeSql('DELETE FROM routeparameters WHERE rowid=1');
            this.dataImport.database.executeSql('VACUUM');
            this.dataImport.database.executeSql(this.dataImport.addRouteParameters,
                [this.plug_schuko,
                    this.plug_cee_blue,
                    this.plug_cee_red,
                    this.plug_type1,
                    this.plug_type2,
                    this.plug_ccs,
                    this.plug_chademo,
                    this.station_normal,
                    this.station_fast]);
        };

        saveFilterOptions();
    }

    public addInfoWindow(marker, stationInformation) {
        marker.addListener('click', () => {
            if (this.currentWindow != null) {
                this.currentWindow.close();
            }

            let plug_type_tag = '';

            for (const result of marker['plug_types']) {
                switch (result) {
                    case 'AC Schuko':
                        plug_type_tag += `<ion-row><img src="assets/icon/schuko.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'AC CEE 3 polig':
                        plug_type_tag += `<ion-row><img src="assets/icon/cee_blue.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'AC CEE 5 polig':
                        plug_type_tag += `<ion-row><img src="assets/icon/cee_red.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'AC Kupplung Typ 2':
                        plug_type_tag += `<ion-row><img src="assets/icon/type2.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'AC Steckdose Typ 2':
                        plug_type_tag += `<ion-row><img src="assets/icon/type2.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'DC Kupplung Combo':
                        plug_type_tag += `<ion-row><img src="assets/icon/ccs.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'DC CHAdeMO':
                        plug_type_tag += `<ion-row><img src="assets/icon/chademo.png" width="17" height="17"></ion-row>`;
                        break;
                    case 'Steckdose Typ 1':
                        plug_type_tag += `<ion-row><img src="assets/icon/type1.png" width="17" height="17"></ion-row>`;
                        break;
                    default:
                        console.log('sorry this plug_type does not exist');
                }
            }

            const infowindow = new google.maps.InfoWindow({
                maxWidth: 320,
                content: `<ion-row style="margin-bottom: 7px">
                            <ion-col size="auto">
                                <button id="isNotFavorite" style="background: none; position: absolute; top: 1px; left: -5px">
                                <ion-icon name="star-outline" style="font-size: 19px; color: #868e96"></ion-icon></button>
                                <button id="isFavorite" style="background: none; position: absolute; top: 1px; left: -5px">
                                <ion-icon name="star" style="font-size: 19px; color: #007bff"></ion-icon></button>
                            </ion-col>
                            <ion-col size="auto" style="margin-left: 7px">
                                ${stationInformation.operator}
                            </ion-col>
                        </ion-row>
                        <ion-row style="margin-bottom: 7px">
                            <ion-col style="border-right: 1px solid #989aa2; padding-right: 10px" size="auto">
                                ${stationInformation['adress']}<br/>
                                ${stationInformation['place']}
                            </ion-col>
                            <ion-col size="auto" style="padding-left: 10px">
                               ${plug_type_tag}
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col size="auto">
                                <a href="javascript:this.getRouteToStation(${stationInformation.lat},
                                ${stationInformation.long});">Route berechnen</a>
                            </ion-col>
                        </ion-row>`
            });

            google.maps.event.addListenerOnce(infowindow, 'domready', () => {

                const result = this.favorites.find(station => JSON.stringify(station) === JSON.stringify(stationInformation));

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
                    this.favorites.push(stationInformation);
                    this.dataImport.database.executeSql(this.dataImport.addFav,
                        [stationInformation['operator'],
                            stationInformation['adress'],
                            stationInformation['place'],
                            stationInformation['long'],
                            stationInformation['lat'],
                            stationInformation['commissioning_date'],
                            stationInformation['power_consumption'],
                            stationInformation['station_type'],
                            stationInformation['number_of_charging_points'],
                            stationInformation['plug_type_1'],
                            stationInformation['kW_1'],
                            stationInformation['public_key_1'],
                            stationInformation['plug_type_2'],
                            stationInformation['kW_2'],
                            stationInformation['public_key_2'],
                            stationInformation['plug_type_3'],
                            stationInformation['kW_3'],
                            stationInformation['public_key_3'],
                            stationInformation['plug_type_4'],
                            stationInformation['kW_4'],
                            stationInformation['public_key_4'],
                            stationInformation['station_type']]);

                    document.getElementById('isNotFavorite').style.visibility = 'hidden';
                    document.getElementById('isFavorite').style.visibility = 'visible';
                });
                document.getElementById('isFavorite').addEventListener('click', () => {
                    for (let j = 0; j < this.favorites.length; j++) {
                        if (JSON.stringify(this.favorites[j]) === JSON.stringify(stationInformation)) {
                            this.favorites.splice(j, 1);
                            const rowid = j + 1;
                            this.dataImport.database.executeSql(`DELETE FROM favorites WHERE rowid=` + rowid).catch((data) => {
                                console.log(data);
                            });
                            this.dataImport.database.executeSql(`VACUUM`).catch((data) => {
                                console.log(data);
                            });
                        }
                    }
                    document.getElementById('isFavorite').style.visibility = 'hidden';
                    document.getElementById('isNotFavorite').style.visibility = 'visible';
                });
            });

            infowindow.open(this.map, marker);
            this.currentWindow = infowindow;
        });
    }

    public changeMapStyle() {
        if (this.isNight) {
            this.isNight = false;
            this.map.mapTypes.set('day_map', this.mapStyleService.mapStyleDay);
            this.map.setMapTypeId('day_map');
            this.markerCluster.clearMarkers();
            if (this.markersShown) {
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsDay);
            }

        } else if (!this.isNight) {
            this.isNight = true;
            this.map.mapTypes.set('night_map', this.mapStyleService.mapStyleNight);
            this.map.setMapTypeId('night_map');
            this.markerCluster.clearMarkers();
            if (this.markersShown) {
                this.markerCluster = new MarkerClusterer(this.map, this.stationMarkers, this.mcOptionsNight);
            }
        }
    }
}
