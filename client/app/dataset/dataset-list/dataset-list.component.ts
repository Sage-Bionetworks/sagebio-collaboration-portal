import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { combineLatest, of, empty } from 'rxjs';
import { filter, map, switchMap, tap, mergeMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatasetService } from '../dataset.service';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { DataCatalogService } from '../../data-catalog/data-catalog.service';
import { Filter } from '../../../components/filters/filter.model';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import config from '../../app.constants';
import { NotificationService } from '../../../components/notification/notification.service';

@Component({
    selector: 'dataset-list',
    template: require('./dataset-list.html'),
    styles: [require('./dataset-list.scss')],
})
export class DatasetListComponent implements OnInit, AfterViewInit {
    private datasets: CkanDataset[] = [];
    private catalogs: DataCatalog[] = [];
    private catalog: DataCatalog;

    private catalogFilters: Filter[] = [];
    private orderFilters: Filter[] = [];

    private numDatasetsPerPage = 8;
    private searchData: any;
    private searchPageIndex: number;
    private searchResultCount = 0;
    private catalogNotReached = false;

    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    static parameters = [Router, PageTitleService, DatasetService,
        DataCatalogService, NotificationService];
    constructor(private router: Router,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService,
        private catalogService: DataCatalogService,
        private notificationService: NotificationService) {

        this.orderFilters = values(config.datasetOrders);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Datasets';
    }

    ngAfterViewInit() {
        this.catalogService.getDataCatalogs()
            .pipe(
                map(catalogs => {
                    this.catalogs = orderBy('name', 'asc', catalogs);
                    console.log('catalog', this.catalogs);
                    this.catalogFilters = this.catalogs.map((c, i) => ({
                        value: c._id,
                        title: c.name,
                        active: i === 0
                    }));
                    return this.filters.map(f => f.getSelectedFilter());
                }),
                mergeMap(f => {
                    return combineLatest(...f)
                        .pipe(
                            map(myFilters =>
                                flow([
                                    keyBy('group'),
                                    mapValues('value')
                                ])(myFilters)
                            )
                        );
                }),
                filter(query => !!query.catalog),
                tap(query => {
                    // console.log('query', query);
                    this.searchData = query;
                    this.catalogNotReached = false;
                }),
                switchMap(query => this.datasetService.searchDatasetsByCatalog(
                    this.catalogs.find(c => c._id === query.catalog),
                    query.searchTerms,
                    query.orderedBy,
                    this.numDatasetsPerPage
                )
                    .pipe(
                        catchError(err => {
                            console.log(err);
                            // this.notificationService.error('Unable to connect to Data Catalog');
                            this.clearResults();
                            this.catalogNotReached = true;
                            return empty();
                        })
                    ))
            )
            .subscribe(res => {
                this.catalog = this.catalogs.find(c => c._id === this.searchData.catalog);
                this.datasets = res.result.results;
                this.searchResultCount = res.result.count;
                this.searchPageIndex = 1;
                console.log('datasets', this.datasets);
            }, err => {
                console.log(err);
                this.notificationService.error(err.message);
                this.clearResults();
            });
    }

    clearResults(): void {
        this.datasets = [];
        this.catalog = undefined;
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }

    showMoreResults(): void {
        this.datasetService.searchDatasetsByCatalog(
            this.catalogs.find(c => c._id === this.searchData.catalog),
            this.searchData.searchTerms,
            this.searchData.orderedBy,
            this.numDatasetsPerPage,
            this.searchPageIndex + 1
        )
            .subscribe(res => {
                if (res.result.results.length === 0) {
                    this.notificationService.info('No more results');
                }
                this.datasets.push(...res.result.results);
                this.searchPageIndex = this.searchPageIndex + 1;
            });
    }
}
