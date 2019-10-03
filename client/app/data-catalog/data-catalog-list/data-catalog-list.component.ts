import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { DataCatalogService } from '../data-catalog.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';

@Component({
    selector: 'data-catalog-list',
    template: require('./data-catalog-list.html'),
    styles: [require('./data-catalog-list.scss')],
})
export class DataCatalogListComponent implements OnInit {
    private canCreateDataCatalog = false; // used in html

    static parameters = [Router, PageTitleService, UserPermissionDataService, DataCatalogService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private permissionDataService: UserPermissionDataService,
        private catalogService: DataCatalogService // used in html
    ) {}

    ngOnInit() {
        this.pageTitleService.setTitle('Data Catalogs');
        this.permissionDataService
            .permissions()
            .subscribe(
                permissions => (this.canCreateDataCatalog = permissions.canCreateDataCatalog()),
                err => console.error(err)
            ); // unsubscribe in destructor
    }

    onEntityClick(catalog: DataCatalog) {
        if (catalog) {
            this.router.navigate(['/data-catalogs', catalog._id]);
        }
    }

    onCreateNewDataCatalog(): void {
        if (this.canCreateDataCatalog) {
            this.router.navigate(['/', 'data-catalogs', 'new']);
        }
    }
}
