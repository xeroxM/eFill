import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';

import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';
import {DataImportService} from './services/data-import/data-import.service';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite} from '@ionic-native/sqlite/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        Geolocation,
        FormBuilder,
        TextToSpeech,
        DataImportService,
        SQLitePorter,
        SQLite
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
