import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {MapStyleService} from './services/map-style/map-style.service';
import {NavigationService} from './services/navigation/navigation.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public navigationService: NavigationService,
        public mapStyleService: MapStyleService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.mapStyleService.showSplash = true;

            const time = new Date().getHours();

            if (time < 6 || time > 19) {
                this.navigationService.isNight = true;
                this.navigationService.isNightToggle = true;
            } else if (time >= 6 || time <= 19) {
                this.navigationService.isNight = false;
                this.navigationService.isNightToggle = false;
            }
        });
    }
}
