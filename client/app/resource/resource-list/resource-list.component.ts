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

import { Resource } from 'models/entities/resources/resource.model';

@Component({
    selector: 'resource-list',
    template: require('./resource-list.html'),
    styles: [require('./resource-list.scss')],
})
export class ResourceListComponent implements OnInit, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private resources: Resource[] = [];
    private resourceTypeFilters: Filter[] = [];
    private numResultsPerPage = 8;
    private searchPageIndex: number;
    private searchResultCount = 0;

    static parameters = [Router, FormBuilder, PageTitleService, ResourceService,
        NotificationService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private notificationService: NotificationService) {

        this.resourceTypeFilters = config.resourceTypeFilters;
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
    }

    clearResults(): void {
        this.resources = [];
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }
}
