import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

declare var google: any;

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;

    map: any;

    constructor() {
    }

    public showMap() {
        const location = new google.maps.LatLng(52, -0.11);

        const options = {
            center: location,
            zoom: 10
        };

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    }

    ngOnInit() {
        this.showMap();
        console.log(this.mapRef);
    }

}
