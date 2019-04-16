import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataCatalogService } from '../data-catalog.service';
import { DatasetService } from '../../dataset/dataset.service';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { NotificationService } from '../../../components/notification/notification.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import {
    CkanDatasetSearchResponse
} from '../../../../shared/interfaces/ckan/ckan-dataset-search-response.model';

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
    private catalog: DataCatalog;
    private catalogStats: CatalogStats;

    static parameters = [Router, ActivatedRoute, PageTitleService,
        DataCatalogService, DatasetService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private catalogService: DataCatalogService,
        private datasetService: DatasetService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        const dataCatalog = this.route.params.pipe(
            switchMap(res => this.catalogService.getDataCatalog(res.id))
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
            tap(res => console.log('RES', res)),
            map(res => ({
                live: !!res.result,
                datasetCount: res.result ? res.result.count : undefined
            }))
        );

        combineLatest(dataCatalog, catalogStats)
            .subscribe(([catalog, stats]) => {
                this.catalogStats = stats;
                this.catalog = catalog;
                this.pageTitleService.title = catalog.name;
            });



        // this.route.params.subscribe(res => {
        //     this.catalogService.getDataCatalog(res.id).subscribe(catalog => {
        //         // // Get the instances of this data-catalog available to the user
        //         // this.AuthService.isLoggedIn().subscribe(is => {
        //         //   if (is) {
        //         //     this.InstanceService.queryBydata-catalog(data-catalog)
        //         //       .subscribe(instances => {
        //         //         this.instances = instances;
        //         //         this.SocketService.syncUpdates('instance', this.instances);
        //         //       })
        //         //   }
        //         // });
        //         this.pageTitleService.title = catalog.name;
        //         this.catalog = catalog;
        //         console.log('catalog', catalog);
        //     });
        // });
    }

    ngOnDestroy() { }

    // openCkan(data-catalog: DataCatalog): void {
    //     console.log('Not implemented.');
    // }
    //
    // openFacileExplorer(data-catalog: DataCatalog): void {
    //     console.log('Not implemented');
    // }
}
