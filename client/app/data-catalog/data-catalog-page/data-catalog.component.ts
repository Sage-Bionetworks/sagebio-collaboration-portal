import { DataCatalogAuthorizationService } from './../data-catalog-authorization.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataCatalogService } from '../data-catalog.service';
import { DatasetService } from '../../dataset/dataset.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { combineLatest, of, Subscription, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CkanDatasetSearchResponse } from 'models/ckan/ckan-dataset-search-response.model';
import { DataCatalogEditComponent } from '../data-catalog-edit/data-catalog-edit.component';
import { omit } from 'lodash/fp';
import config from '../../app.constants';

interface CatalogStats {
    live: boolean;
    datasetCount: number;
}

@Component({
    selector: 'data-catalog',
    template: require('./data-catalog.html'),
    styles: [require('./data-catalog.scss')],
})
export class DataCatalogComponent implements OnInit, OnDestroy {
    private dataCatalog$: Observable<DataCatalog>;
    private entityType: string;
    private dataCatalogStats: CatalogStats;
    private showEditDataCatalogTemplate = false;
    private canAdminDataCatalog = false;

    private dataCatalogSub: Subscription;
    private dataCatalogStatsSub: Subscription;
    private canAdminDataCatalogSub: Subscription;

    @ViewChild(DataCatalogEditComponent, { static: false }) editTool: DataCatalogEditComponent;

    static parameters = [
        Router,
        ActivatedRoute,
        PageTitleService,
        DataCatalogService,
        DataCatalogAuthorizationService,
        DatasetService,
        NotificationService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private dataCatalogService: DataCatalogService,
        private dataCatalogAuthorizationService: DataCatalogAuthorizationService,
        private datasetService: DatasetService,
        private notificationService: NotificationService
    ) {
        this.entityType = config.entityTypes.DATA_CATALOG.value;
    }

    ngOnInit() {
        this.dataCatalog$ = this.route.params.pipe(switchMap(res => this.dataCatalogService.get(res.id)));

        this.dataCatalogSub = this.dataCatalog$.subscribe(
            catalog => {
                if (catalog) {
                    this.pageTitleService.setTitle(catalog.title);
                }
            },
            err => console.log(err)
        );

        this.canAdminDataCatalogSub = this.dataCatalog$
            .pipe(switchMap(dataCatalog => this.dataCatalogAuthorizationService.canAdmin(dataCatalog._id)))
            .subscribe(
                canAdmin => {
                    console.log('CAN ADMIN CATALOG', canAdmin);
                    this.canAdminDataCatalog = canAdmin;
                },
                err => console.error(err)
            );

        this.dataCatalogStatsSub = this.dataCatalog$
            .pipe(
                switchMap(catalog =>
                    this.datasetService.searchDatasetsByCatalog(catalog).pipe(
                        catchError(err => {
                            // console.log(err);
                            // this.notificationService.error('Unable to connect to Data Catalog');
                            return of(<CkanDatasetSearchResponse>{});
                        })
                    )
                ),
                map(res => ({
                    live: !!res.result,
                    datasetCount: res.result ? res.result.count : undefined,
                }))
            )
            .subscribe(stats => {
                this.dataCatalogStats = stats;
            });
    }

    ngOnDestroy() {
        if (this.dataCatalogSub) {
            this.dataCatalogSub.unsubscribe();
        }
        if (this.dataCatalogStatsSub) {
            this.dataCatalogStatsSub.unsubscribe();
        }
        if (this.canAdminDataCatalogSub) {
            this.canAdminDataCatalogSub.unsubscribe();
        }
    }

    getLink(): string {
        return window.location.href;
    }

    onDataCatalogUpdated(dataCatalog: DataCatalog): void {
        this.showEditDataCatalogTemplate = false;
        // this.dataCatalog = { ...this.dataCatalog, ...omit('organization', dataCatalog) };
        this.notificationService.info('The Data Catalog has been successfully updated');
    }
}
