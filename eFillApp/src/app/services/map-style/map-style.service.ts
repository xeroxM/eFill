import {Injectable} from '@angular/core';

declare let google: any;

@Injectable({
    providedIn: 'root'
})
export class MapStyleService {

    public showSplash = true;

    constructor() {
    }

    public mapStyleDay = new google.maps.StyledMapType(
        [
            {
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#ebe3cd'
                    }
                ]
            },
            {
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#523735'
                    }
                ]
            },
            {
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#f5f1e6'
                    }
                ]
            },
            {
                'featureType': 'administrative',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#c9b2a6'
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#ffeb3b'
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#6b695a'
                    },
                    {
                        'weight': 1
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'weight': 1
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'weight': 1
                    }
                ]
            },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#dcd2be'
                    }
                ]
            },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#ae9e90'
                    }
                ]
            },
            {
                'featureType': 'landscape.man_made',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#eae8d5'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#dfd2ae'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#eae8d5'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#dfd2ae'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#93817c'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#a5b076'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#447530'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#f5f1e6'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#fdfcf8'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#f8c967'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#e9bc62'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.highway.controlled_access',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#e98d58'
                    }
                ]
            },
            {
                'featureType': 'road.highway.controlled_access',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#db8555'
                    }
                ]
            },
            {
                'featureType': 'road.highway.controlled_access',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#806b63'
                    }
                ]
            },
            {
                'featureType': 'transit.line',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#dfd2ae'
                    }
                ]
            },
            {
                'featureType': 'transit.line',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#8f7d77'
                    }
                ]
            },
            {
                'featureType': 'transit.line',
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#ebe3cd'
                    }
                ]
            },
            {
                'featureType': 'transit.station',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#dfd2ae'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#b9d3c2'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#92998d'
                    }
                ]
            }
        ]
    );

    public mapStyleNight = new google.maps.StyledMapType(
        [
            {
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#242f3e'
                    }
                ]
            },
            {
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#746855'
                    }
                ]
            },
            {
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#242f3e'
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#9cb082'
                    },
                    {
                        'weight': 1
                    }
                ]
            },
            {
                'featureType': 'administrative.country',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#9ba98b'
                    }
                ]
            },
            {
                'featureType': 'administrative.land_parcel',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'administrative.locality',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#d7bca8'
                    },
                    {
                        'weight': 1
                    }
                ]
            },
            {
                'featureType': 'landscape.man_made',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#222c39'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#222c39'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#d59563'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#263c3f'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#23353a'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#6b9a76'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#38414e'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#212a37'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#9ca5b3'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#343e4b'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#746855'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#766750'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#242f3e'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'saturation': -25
                    },
                    {
                        'lightness': 5
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#f3d19c'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#2f3642'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#68758a'
                    }
                ]
            },
            {
                'featureType': 'transit',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#2f3948'
                    }
                ]
            },
            {
                'featureType': 'transit.station',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#cc9368'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': [
                    {
                        'color': '#17263c'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#515c6d'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#17263c'
                    }
                ]
            }
        ]
    );

    public clusterStylesDay = [
        {
            textColor: '#eefff1',
            url: 'assets/cluster/a1.png',
            height: 51,
            width: 51
        },
        {
            textColor: '#fffff3',
            url: 'assets/cluster/a2.png',
            height: 53,
            width: 53
        },
        {
            textColor: '#ffe5cc',
            url: 'assets/cluster/a3.png',
            height: 66,
            width: 66
        },
        {
            textColor: '#6c6c6c',
            url: 'assets/cluster/a4.png',
            height: 78,
            width: 78
        },
        {
            textColor: '#6c6c6c',
            url: 'assets/cluster/a5.png',
            height: 78,
            width: 78
        },
    ];

    public clusterStylesNight = [
        {
            textColor: '#393939',
            url: 'assets/cluster/b1.png',
            height: 51,
            width: 51
        },
        {
            textColor: '#283040',
            url: 'assets/cluster/b2.png',
            height: 53,
            width: 53
        },
        {
            textColor: '#97c6ce',
            url: 'assets/cluster/b3.png',
            height: 66,
            width: 66
        },
        {
            textColor: '#8ec3b9',
            url: 'assets/cluster/b4.png',
            height: 78,
            width: 78
        },
        {
            textColor: '#8ec3b9',
            url: 'assets/cluster/b5.png',
            height: 78,
            width: 78
        },
    ];

    public innerCircle = {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1.0,
        fillColor: '#007bff',
        strokeOpacity: 1.0,
        strokeColor: 'white',
        strokeWeight: 0.8,
        scale: 5
    };

    public outerCircle = {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 0.1,
        fillColor: '#007bff',
        strokeOpacity: 1.0,
        strokeColor: '#007bff',
        strokeWeight: 0.1,
        scale: 25
    };

}
