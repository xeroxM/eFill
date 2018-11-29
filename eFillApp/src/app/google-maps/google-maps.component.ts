import {Component, OnInit} from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Environment
} from '@ionic-native/google-maps/ngx';
import {ProvideApikeyService} from '../../services/provide-apikey.service';

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
    map: GoogleMap;

    constructor(public apiKeySerive: ProvideApikeyService) {
    }

    loadMap() {

        // This code is necessary for browser
        this.apiKeySerive.provideApiKey();

        const mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 50.927885,
                    lng: 6.927923
                },
                zoom: 18,
                tilt: 30
            }
        };

        this.map = GoogleMaps.create('map_canvas', mapOptions);

        const marker: Marker = this.map.addMarkerSync({
            title: 'Uni Köln',
            icon: 'red',
            animation: 'DROP',
            position: {
                lat: 50.927885,
                lng: 6.927923
            }
        });
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            alert('clicked');
        });
    }

    ngOnInit() {
        this.loadMap();
    }

}
