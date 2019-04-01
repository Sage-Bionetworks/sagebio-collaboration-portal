import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InsightService } from '../insight.service';
import { Insight } from '../../../../shared/interfaces/insight.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';

@Component({
    selector: 'insight-list',
    template: require('./insight-list.html'),
    styles: [require('./insight-list.scss')],
})
export class InsightListComponent implements OnInit, AfterViewInit {
    private insights: Observable<Insight[]>;

    static parameters = [Router, FormBuilder, PageTitleService, InsightService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService) {
        this.insights = this.insightService.getInsights();
    }

    ngOnInit() {
        this.pageTitleService.title = 'Insights';
    }

    ngAfterViewInit() {
    }
}
