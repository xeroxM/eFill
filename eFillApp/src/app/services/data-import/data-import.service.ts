import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';




@Injectable()
export class DataImportService {
    database: SQLiteObject;
    public databaseReady: BehaviorSubject<boolean>;

    public addFav = 'INSERT INTO Favorites VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

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
                    this.storage.set('database_filled', await this.checkTableExists('loadingstations'));
                    this.storage.set('database_filled', await this.checkTableExists('favorites'));
                    // this.storage.set('database_filled', false);
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
                   // console.log(await this.getAllDBEntries());
                    /*console.log(await this.getAllFavEntries());*/
                }).catch(e => console.error(e));
        });
    }

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
    }
    public async getAllFavEntries() {
        const temp2 = [];
        await this.database.executeSql('SELECT * FROM favorites').then(data => {
            for (let i = 0; i < data.rows.length; i++) {
                temp2.push(data.rows.item(i));
            }
        }).catch(data => {
            for (let i = 0; i < data.rows.length; i++) {
                temp2.push(data.rows.item(i));
            }
        });
        return temp2;
    }
    /*public addFavorite(operator, adress, place, long, lat, commissioning_date, power_consumption, station_type, number_of_charging_points, plug_type_1, kW_1, public_key_1, plug_type_2, kW_2, public_key_2, plug_type_3, kW_3, public_key_3, plug_type_4, kW_4, public_key_4) {
        const data = [operator, adress, place, long, lat, commissioning_date, power_consumption, station_type, number_of_charging_points, plug_type_1, kW_1, public_key_1, plug_type_2, kW_2, public_key_2, plug_type_3, kW_3, public_key_3, plug_type_4, kW_4, public_key_4];
        return this.database.executeSql('INSERT INTO Favorites (operator, adress, place, long, lat, commissioning_date, power_consumption, station_type, number_of_charging_points, plug_type_1, kW_1, public_key_1, plug_type_2, kW_2, public_key_2, plug_type_3, kW_3, public_key_3, plug_type_4, kW_4, public_key_4 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data).then(res => {
            return res;
        });
    }*/
}
