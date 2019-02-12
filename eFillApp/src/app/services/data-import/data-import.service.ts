import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

interface StationInformation {
    long: number;
    lat: number;
    operator: string;
    address: string;
    place: string;
}

@Injectable()
export class DataImportService {
    private url = 'assets/fake-data/loading_stations.json';
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor(private http: HttpClient,
                private sqlitePorter: SQLitePorter,
                private storage: Storage,
                private sqlite: SQLite,
                private platform: Platform) {
        this.databaseReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'eFillCreate.de',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    this.database = db;
                    this.storage.get('database_filled').then(val => {
                        if (val) {
                            this.databaseReady.next(true);
                        } else {
                            this.fillDatabase();
                        }
                    });
                });
        });
    }

   public fillDatabase(): Observable<StationInformation[]> {
        this.http.get<StationInformation[]>('assets/data/eFillDB.sql').pipe(map((res: any) => res.data))
            .subscribe(sql => {
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(data => {
                        this.databaseReady.next(true);
                        this.storage.set('database_filled', true);
                        console.log(sql);
                    });
            });
    }
    getCoordinates(): Observable<StationInformation[]> {
        return this.http.get<StationInformation[]>(this.url);
    }

}
