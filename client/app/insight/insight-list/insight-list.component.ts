import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InsightService } from '../insight.service';
import { StateService } from '../../state/state.service';
import { State } from '../../../../shared/interfaces/state.model';
import { Insight } from '../../../../shared/interfaces/insight.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';

@Component({
    selector: 'insight-list',
    template: require('./insight-list.html'),
    styles: [require('./insight-list.scss')],
})
export class InsightListComponent implements OnInit, AfterViewInit {
    private states: State[];
    private reports: Insight[];
    private insights: Insight[];

    static parameters = [Router, FormBuilder, PageTitleService, InsightService,
        StateService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private stateService: StateService) {
        // this.insights = this.insightService.getInsights();

        const myStates = this.stateService.getStates();

        combineLatest(
            this.stateService.getStates(),
            this.insightService.getInsights()
        )
            .pipe(
                map(([states, reports]) => {
                    this.states = states;
                    this.reports = reports;
                    this.insights = orderBy('createdAt', 'desc', reports.concat(states));
                })
            )
            .subscribe(res => console.log('done', res));
    }

    ngOnInit() {
        this.pageTitleService.title = 'Insights';
    }

    ngAfterViewInit() {
    }
}
