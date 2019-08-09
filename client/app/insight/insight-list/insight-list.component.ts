import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InsightService } from '../insight.service';
import { InsightNewComponent } from '../insight-new/insight-new.component';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import config from '../../app.constants';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';
import { Report } from 'models/entities/insights/report.model';
import { ReportViewComponent } from '../report-view/report-view.component';

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

    @ViewChild(InsightNewComponent, { static: false }) newInsight: InsightNewComponent;
    private createNewInsight = false;

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
    }

    onNewInsight(insight: Insight): void {
        this.createNewInsight = false;
        this.notificationService.info('The Insight has been successfully created');
    }

    clearResults(): void {
        this.insights = [];
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }
}
