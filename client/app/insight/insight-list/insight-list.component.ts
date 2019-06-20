import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InsightService } from '../insight.service';
// import { StateService } from '../../state/state.service';
import { NotificationService } from '../../../components/notification/notification.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import config from '../../app.constants';
import { Filter } from '../../../components/filters/filter.model';
import { FiltersComponent } from '../../../components/filters/filters.component';

import { Insight } from '../../../../shared/interfaces/insights/insight.model';
import { State } from '../../../../shared/interfaces/insights/state.model';
import { Report } from '../../../../shared/interfaces/insights/report.model';
import { Dashboard } from '../../../../shared/interfaces/insights/dashboard.model';
import { DashboardViewComponent } from '../dashboard-view/dashboard-view.component';

@Component({
    selector: 'insight-list',
    template: require('./insight-list.html'),
    styles: [require('./insight-list.scss')],
})
export class InsightListComponent implements OnInit, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    // private states: State[];
    // private reports: Insight[];
    private insights: Insight[] = [];

    private insightTypeFilters: Filter[] = [];

    private numResultsPerPage = 8;
    // private searchData: any;
    private searchPageIndex: number;
    private searchResultCount = 0;

    static parameters = [Router, FormBuilder, PageTitleService, InsightService,
        NotificationService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private notificationService: NotificationService) {

        this.insightTypeFilters = config.insightTypeFilters;


        // this.insights = this.insightService.getInsights();

        // const myStates = this.stateService.getStates();

        // combineLatest(
        //     this.stateService.getStates(),
        //     this.insightService.getInsights()
        // )
        //     .pipe(
        //         map(([states, reports]) => {
        //             this.states = states;
        //             this.reports = reports;
        //             this.insights = orderBy('createdAt', 'desc', reports.concat(states));
        //         })
        //     )
        //     .subscribe(res => console.log('done', res));
    }

    ngOnInit() {
        this.pageTitleService.title = 'Insights';
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
                tap(query => console.log('QUERY', query)),
                switchMap(query => this.insightService.getInsights(query)),
                map(insights => orderBy('createdAt', 'asc', insights))
            )
            .subscribe(insights => {
                this.insights = insights;
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
        this.insights = [];
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }
}
