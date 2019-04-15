import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatasetService } from '../dataset.service';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { DatasetSearchComponent } from '../dataset-search/dataset-search.component';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';
// import { DatasetCatalogFiltersComponent } from './dataset-catalog-filters/dataset-catalog-filters.component';
// import { DatasetCatalogFilterComponent } from './dataset-catalog-filter/dataset-catalog-filter.component';
// import { DatasetSearchFilterComponent } from './dataset-search-filter/dataset-catalog-filter.component';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { DataCatalogService } from '../../data-catalog/data-catalog.service';

import { Filter } from '../../../components/filters/filter.model';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { flow, keyBy, mapValues, values, find } from 'lodash/fp';
import { datasetOrders } from '../../app.constants';
// import { NotificationService } from '../../components/notification/notification.service';

@Component({
    selector: 'dataset-list',
    template: require('./dataset-list.html'),
    styles: [require('./dataset-list.scss')],
})
export class DatasetListComponent implements OnInit, AfterViewInit {
    private datasets: CkanDataset[];
    private catalogs: DataCatalog[] = [];

    private catalogFilters: Filter[] = [];
    private orderFilters: Filter[] = [];

    private numDatasetsPerPage = 4;
    private searchData: any;
    private searchPageIndex: number;

    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    static parameters = [Router, FormBuilder, PageTitleService, DatasetService,
        DataCatalogService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService,
        private catalogService: DataCatalogService) {

        this.orderFilters = values(datasetOrders);
        // catalogService.getDataCatalogs()
        //     .subscribe(catalogs => {
        //         this.catalogs = catalogs;
        //         this.catalogFilters = catalogs.map((c, i) => ({
        //             value: c._id,
        //             title: c.name,
        //             active: i === 0
        //         }));
        //         console.log('CATALOG SUBSCRIBE DONE');
        //     });

        console.log('CONSTRUCTOR DONE');

        // catalogService.getDataCatalogs()
        //     .pipe(
        //         concatMap(catalogs => {
        //             return forkJoin(
        //                 of(catalogs),
        //                 datasetService.getDatasets(catalogs)
        //             );
        //         })
        //     )
        //     .subscribe(([catalogs, datasets]) => {
        //         this.catalogs = catalogs;
        //         this.catalogFilters = catalogs.map((c, i) => ({
        //             value: c._id,
        //             title: c.name,
        //             active: i === 0
        //         }));
        //
        //         console.log('SUBSCRIBE');
        //         // this.datasets = datasets;
        //         // console.log('datasets', datasets);
        //         // datasetService.getAllDatasetsByCatalog(catalogs[1])
        //         //     .subscribe(d => console.log('NUM DATASETS', datasets.length));
        //     });


        // this.catalogs = values(constants.gameTags);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Datasets';
    }

    ngAfterViewInit() {
        this.catalogService.getDataCatalogs()
            .pipe(
                map(catalogs => {
                    this.catalogs = catalogs;
                    this.catalogFilters = catalogs.map((c, i) => ({
                        value: c._id,
                        title: c.name,
                        active: i === 0
                    }));
                    return this.filters.map(f => f.getSelectedFilter());
                }),
                mergeMap(f => {
                    console.log('combineLatest');
                    return combineLatest(...f)
                        .pipe(
                            map(myFilters =>
                                flow([
                                    keyBy('group'),
                                    mapValues('value')
                                ])(myFilters)
                            ),
                            tap(query => console.log('QUERY', query))
                        );
                }),
                filter(query => !!query.catalog),
                tap(query => {
                    console.log('query', query);
                    this.searchData = query;
                }),
                switchMap(query => {
                    console.log('DO QUERY', query);
                    const catalog = this.catalogs.find(c => c._id === query.catalog);
                    console.log('catalog', catalog);
                    var x = this.datasetService.searchDatasetsByCatalog(
                        catalog,
                        query.searchTerms,
                        query.orderedBy,
                        this.numDatasetsPerPage
                    );
                    console.log('X', x);
                    return x;
                }),
                tap(shouldBeDataset => console.log('should be dataset', shouldBeDataset))
            )
            .subscribe(res => {
                console.log('res', res);
                this.datasets = res.result.results;
                this.searchPageIndex = 1;
            });
    }

    showMoreResults(): void {
        const catalog = this.catalogs.find(c => c._id === this.searchData.catalog);
        this.datasetService.searchDatasetsByCatalog(
            catalog,
            this.searchData.searchTerms,
            this.searchData.orderedBy,
            this.numDatasetsPerPage,
            this.searchPageIndex + 1
        )
            .subscribe(res => {
                // if (res.result.results.length === 0) {
                //     this.notificationService.info('No more results');
                // }
                this.datasets.push(...res.result.results);
                this.searchPageIndex = this.searchPageIndex + 1;
            });
    }
}
