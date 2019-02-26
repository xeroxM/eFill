import {Component} from '@angular/core';
import {NavigationService} from '../../services/navigation/navigation.service';
import {DataImportService} from '../../services/data-import/data-import.service';

@Component({
    selector: 'app-contact',
    templateUrl: 'favorites.page.html',
    styleUrls: ['favorites.page.scss']
})
export class FavoritesPage {

    constructor(public navigationService: NavigationService, public dataImport: DataImportService) {
    }

    public removeFavorite(favorites, index) {
        favorites.splice(index, 1);
        const rowid = index + 1;
        this.dataImport.database.executeSql(`DELETE FROM favorites WHERE rowid=` + rowid);
        this.dataImport.database.executeSql(`VACUUM`);
    }
}
