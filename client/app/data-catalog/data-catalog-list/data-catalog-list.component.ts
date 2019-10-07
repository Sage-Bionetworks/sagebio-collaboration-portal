import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalogAuthorizationService } from './../data-catalog-authorization.service';

@Component({
    selector: 'data-catalog-list',
    template: require('./data-catalog-list.html'),
    styles: [require('./data-catalog-list.scss')],
})
export class DataCatalogListComponent implements OnInit, OnDestroy {
    private canCreateDataCatalog = false;
    private canCreateDataCatalogSub: Subscription;

    static parameters = [
        Router,
        NotificationService,
        PageTitleService,
        DataCatalogService,
        DataCatalogAuthorizationService,
    ];
    constructor(
        private router: Router,
        private notificationService: NotificationService,
        private pageTitleService: PageTitleService,
        private catalogService: DataCatalogService, // used in html
        private catalogAuthorizationService: DataCatalogAuthorizationService
    ) {}

    ngOnInit() {
        this.pageTitleService.setTitle('Data Catalogs');

        this.canCreateDataCatalogSub = this.catalogAuthorizationService.canCreate().subscribe(
            canCreate => {
                this.canCreateDataCatalog = canCreate;
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        if (this.canCreateDataCatalogSub) {
            this.canCreateDataCatalogSub.unsubscribe();
        }
    }

    onEntityClick(catalog: DataCatalog) {
        if (catalog) {
            this.router.navigate(['/data-catalogs', catalog._id]);
        }
    }

    newDataCatalog(): void {
        if (this.canCreateDataCatalog) {
            this.router.navigate(['/', 'data-catalogs', 'new']);
        } else {
            this.notificationService.info('Not available to Users yet.');
        }
    }
}
