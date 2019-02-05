import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {File} from '@ionic-native/file/ngx';

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

    private urlNEW = 'https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Energie/Unternehmen_Institutionen/HandelundVertrieb/Ladesaeulen/Ladesaeulenkarte_Datenbankauszug19.xlsx';

    constructor(private http: HttpClient, public file: File, public transfer: FileTransfer) {
    }

    public downloadAndSavePicture() {
        this.http.get(this.urlNEW, {responseType: 'blob'})
            .subscribe((imageBlob: Blob) => {
                // imageBlob is the binary data of the the image
                // From here you can manipulate it and store it where you want
                // For example, to store it in your app dir
                // The replace true is optional but is just in case you want to overwrite it
                return this.file.writeFile(this.file.dataDirectory, 'my_downloaded_image', imageBlob, {replace: true});
            });
    }

    getCoordinates(): Observable<StationInformation[]> {
        return this.http.get<StationInformation[]>(this.url);
    }
}
