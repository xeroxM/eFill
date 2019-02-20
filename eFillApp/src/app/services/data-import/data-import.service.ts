import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';

interface StationInformation {
    long: number;
    lat: number;
    operator: string;
    address: string;
    place: string;
}


@Injectable()
export class DataImportService {
    // private url = 'assets/fake-data/loading_stations.json';
    database: SQLiteObject;
    public databaseReady: BehaviorSubject<boolean>;
    public stationInformation = [];

    constructor(private http: HttpClient,
                private sqlitePorter: SQLitePorter,
                private storage: Storage,
                private sqlite: SQLite,
                private platform: Platform) {
        this.databaseReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'eFill.db',
                location: 'default'
            })
                .then(async (db: SQLiteObject) => {
                    this.database = db;
                    await this.database.executeSql('DROP TABLE IF EXISTS loadingstations').then(() => {
                    }).catch(() => {
                    });
                    this.storage.set('database_filled', await this.checkTableExists('loadingstations'));
                    console.log('Cleared table');
                    this.storage.get('database_filled').then(async val => {
                        if (val) {
                            this.databaseReady.next(true);
                        } else {
                            this.fillDatabase();
                        }
                    });
                });
        });
    }

    public async fillDatabase() {
        await this.http.get('assets/data/efillDB.sql', {responseType: 'text' as 'text'}).subscribe(sql => {
            const time = Date.now();
            console.log('Starting DB import');
            this.sqlitePorter.importSqlToDb(this.database._objectInstance, sql)
                .then(async () => {
                    this.databaseReady.next(true);
                    this.storage.set('database_filled', true);
                    console.log(`Importing DB took ${Date.now() - time} milliseconds`);
                    console.log(await this.getAllDBEntries());
                }).catch(e => console.error(e));
        });
    }

    /*getCoordinates(): Observable<StationInformation[]> {
        return this.http.get<StationInformation[]>(this.url);
    }*/

    public async checkTableExists(tablename) {
        let res = {
            rows: {
                length: 0,
                item: (i) => {
                }
            }
        };
        await this.database.executeSql(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tablename}';`)
            .then(e => res = e)
            .catch(e => res = e);
        return (res.rows.length > 0);
    }

    public async getAllDBEntries() {
        const temp = [];
        await this.database.executeSql('SELECT * FROM loadingstations').then(data => {
            for (let i = 0; i < data.rows.length; i++) {
                temp.push(data.rows.item(i));
            }
        }).catch(data => {
            for (let i = 0; i < data.rows.length; i++) {
                temp.push(data.rows.item(i));
            }
        });
        return temp;
        // console.log(temp, 'Hello');
    }
}
