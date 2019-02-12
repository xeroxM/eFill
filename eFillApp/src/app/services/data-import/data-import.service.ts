import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class DataImportService {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;
    constructor(private http: HttpClient, private sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform)
    {
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

    fillDatabase() {
        this.http.get('assets/data/eFillDB.sql')
            .map(res => res.text())
            .subscribe(sql => {
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(data => {
                        this.databaseReady.next(true);
                        this.storage.set('database_filled', true);
                    });
            });
    }
}
