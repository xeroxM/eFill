import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface StationInformation {
    long: number;
    lat: number;
    operator: string;
    address: string;
    place: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataImportService {

    private url = 'assets/fake-data/loading_stations.json';

    constructor(private http: HttpClient) {
    }

    getCoordinates(): Observable<StationInformation[]> {
        return this.http.get<StationInformation[]>(this.url);
    }
}
