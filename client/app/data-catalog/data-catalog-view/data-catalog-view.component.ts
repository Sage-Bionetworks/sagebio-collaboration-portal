import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalog } from 'models/data-catalog.model';

@Component({
    selector: 'data-catalog-view',
    template: require('./data-catalog-view.html'),
    styles: [require('./data-catalog-view.scss')],
})
export class DataCatalogViewComponent {
    @Input() private catalog: DataCatalog;

    static parameters = [Router];
    constructor(private router: Router) { }

    // get dataCatalog() {
    //     return this._dataCatalog;
    // }
    //
    // @Input()
    // set dataCatalog(dataCatalog) {
    //     this._dataCatalog = dataCatalog;
    // }

    openCatalogWebsite(website): void {
        window.open(website, '_blank').opener = null;  // 'noopener,noreferrer'
    }
}
