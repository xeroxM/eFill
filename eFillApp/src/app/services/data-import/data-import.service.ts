import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface Coordinates {
    long: number;
    lat: number;
}

@Injectable({
    providedIn: 'root'
})
export class DataImportService {

    private url = 'assets/fake-data/loading_stations.json';

    constructor(private http: HttpClient) {
    }

    getCoordinates(): Observable<Coordinates[]> {
        return this.http.get<Coordinates[]>(this.url);
    }

}
