import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResourceService } from '../resource.service';
// import { StateService } from '../../state/state.service';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import config from '../../app.constants';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Resource } from 'models/resources/resource.model';
import { State } from 'models/resources/state.model';
import { Dashboard } from 'models/resources/dashboard.model';
import { DashboardViewComponent } from '../dashboard-view/dashboard-view.component';
import { StateViewComponent } from '../state-view/state-view.component';

@Component({
    selector: 'resource-list',
    template: require('./resource-list.html'),
    styles: [require('./resource-list.scss')],
})
export class ResourceListComponent implements OnInit, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    // private states: State[];
    // private reports: Resource[];
    private resources: Resource[] = [];

    private resourceTypeFilters: Filter[] = [];

    private numResultsPerPage = 8;
    // private searchData: any;
    private searchPageIndex: number;
    private searchResultCount = 0;

    static parameters = [Router, FormBuilder, PageTitleService, ResourceService,
        NotificationService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private notificationService: NotificationService) {

        this.resourceTypeFilters = config.resourceTypeFilters;


        // this.resources = this.resourceService.getResources();

        // const myStates = this.stateService.getStates();

        // combineLatest(
        //     this.stateService.getStates(),
        //     this.resourceService.getResources()
        // )
        //     .pipe(
        //         map(([states, reports]) => {
        //             this.states = states;
        //             this.reports = reports;
        //             this.resources = orderBy('createdAt', 'desc', reports.concat(states));
        //         })
        //     )
        //     .subscribe(res => console.log('done', res));
    }

    ngOnInit() {
        this.pageTitleService.title = 'Resources';
    }

    ngAfterViewInit() {
        let selectedFilters = this.filters.map(f => f.getSelectedFilter());
        combineLatest(...selectedFilters)
            .pipe(
                map(myFilters =>
                    flow([
                        keyBy('group'),
                        mapValues('value')
                    ])(myFilters)
                ),
                switchMap(query => this.resourceService.getResources(query)),
                map(resources => orderBy('createdAt', 'asc', resources))
            )
            .subscribe(resources => {
                this.resources = resources;
            }, err => {
                console.log(err);
                this.notificationService.error(err.message);
                this.clearResults();
            });

        // this.catalogService.getDataCatalogs()
        //     .pipe(
        //         map(catalogs => {
        //             this.catalogs = orderBy('name', 'asc', catalogs);
        //             console.log('catalog', this.catalogs);
        //             this.catalogFilters = this.catalogs.map((c, i) => ({
        //                 value: c._id,
        //                 title: c.name,
        //                 active: i === 0
        //             }));
        //             return this.filters.map(f => f.getSelectedFilter());
        //         }),
        //         mergeMap(f => {
        //             return combineLatest(...f)
        //                 .pipe(
        //                     map(myFilters =>
        //                         flow([
        //                             keyBy('group'),
        //                             mapValues('value')
        //                         ])(myFilters)
        //                     )
        //                 );
        //         }),
        //         filter(query => !!query.catalog),
        //         tap(query => {
        //             // console.log('query', query);
        //             this.searchData = query;
        //             this.catalogNotReached = false;
        //         }),
        //         switchMap(query => this.datasetService.searchDatasetsByCatalog(
        //             this.catalogs.find(c => c._id === query.catalog),
        //             query.searchTerms,
        //             query.orderedBy,
        //             this.numDatasetsPerPage
        //         )
        //             .pipe(
        //                 catchError(err => {
        //                     console.log(err);
        //                     // this.notificationService.error('Unable to connect to Data Catalog');
        //                     this.clearResults();
        //                     this.catalogNotReached = true;
        //                     return empty();
        //                 })
        //             ))
        //     )
        //     .subscribe(res => {
        //         this.catalog = this.catalogs.find(c => c._id === this.searchData.catalog);
        //         this.datasets = res.result.results;
        //         this.searchResultCount = res.result.count;
        //         this.searchPageIndex = 1;
        //         console.log('datasets', this.datasets);
        //     }, err => {
        //         console.log(err);
        //         this.notificationService.error(err.message);
        //         this.clearResults();
        //     });
    }

    clearResults(): void {
        this.resources = [];
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }
}
