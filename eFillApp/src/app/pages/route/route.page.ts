import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';
import {NavController} from '@ionic/angular';
import {FormBuilder, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-route',
    templateUrl: './route.page.html',
    styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {

    public routeForm: FormGroup;

    constructor(public navigationService: NavigationService, public navCtrl: NavController, public fb: FormBuilder) {
    }

    ngOnInit() {
        this.routeForm = this.fb.group({
            start_point: ['', Validators.required],
            way_point: ['', Validators.required],
            end_point: ['', Validators.required]
        });
    }

}
