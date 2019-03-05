import {Component, OnInit} from '@angular/core';
import {MapStyleService} from '../../services/map-style/map-style.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    constructor(public mapStyleService: MapStyleService) {
    }

    ngOnInit() {
    }

}
