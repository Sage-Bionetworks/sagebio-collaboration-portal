import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { DataCatalogService } from '../data-catalog.service';

@Component({
    selector: 'data-catalog-list',
    template: require('./data-catalog-list.html'),
    styles: [require('./data-catalog-list.scss')],
})
export class DataCatalogListComponent implements OnInit {
    static parameters = [Router, PageTitleService, DataCatalogService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private catalogService: DataCatalogService
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Data Catalogs';
    }

    onEntityClick(catalog: DataCatalog) {
        if (catalog) {
            this.router.navigate(['/data-catalogs', catalog._id]);
        }
    }
}
