import {Injectable} from '@angular/core';

declare let google: any;

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor() {
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
