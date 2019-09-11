import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataCatalogService } from '../data-catalog.service';
import { DatasetService } from '../../dataset/dataset.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { combineLatest, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {
    CkanDatasetSearchResponse
} from 'models/ckan/ckan-dataset-search-response.model';
import { DataCatalogEditComponent } from '../data-catalog-edit/data-catalog-edit.component';
import { omit } from 'lodash/fp';
import config from "../../app.constants";

interface CatalogStats {
    live: boolean;
    datasetCount: number;
}

@Component({
    selector: 'data-catalog',
    template: require('./data-catalog.html'),
    styles: [require('./data-catalog.scss')],
})
export class DataCatalogComponent implements OnInit {
    private dataCatalog: DataCatalog;
    private catalogStats: CatalogStats;

    @ViewChild(DataCatalogEditComponent, { static: false }) editTool: DataCatalogEditComponent;
    private showEditDataCatalogTemplate = false;

    private canEditDataCatalog = true;
    private canDeleteDataCatalog = true;
    private entityType = config.entityTypes.DATA_CATALOG.value

    static parameters = [Router, ActivatedRoute, PageTitleService,
        DataCatalogService, DatasetService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private dataCatalogService: DataCatalogService,
        private datasetService: DatasetService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        const dataCatalog = this.route.params.pipe(
            switchMap(res => this.dataCatalogService.get(res.id))
        );
        const catalogStats = dataCatalog.pipe(
            switchMap(catalog => this.datasetService.searchDatasetsByCatalog(catalog)
                .pipe(
                    catchError(err => {
                        // console.log(err);
                        // this.notificationService.error('Unable to connect to Data Catalog');
                        return of(<CkanDatasetSearchResponse>{});
                    })
                )),
            map(res => ({
                live: !!res.result,
                datasetCount: res.result ? res.result.count : undefined
            }))
        );

        combineLatest(dataCatalog, catalogStats)
            .subscribe(([catalog, stats]) => {
                this.catalogStats = stats;
                this.dataCatalog = catalog;
                this.pageTitleService.title = catalog.title;
            });
    }

    onEditDataCatalog(dataCatalog: DataCatalog): void {
        this.showEditDataCatalogTemplate = false;
        this.dataCatalog = { ...this.dataCatalog, ... omit('organization', dataCatalog)};
        this.notificationService.info('The Data Catalog has been successfully updated');
    }

    onDeleteDataCatalog(): void {
        console.log('DELETE');
    }
}
