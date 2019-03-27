import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../../../../shared/interfaces/dataset.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';

@Component({
    selector: 'dataset-list',
    template: require('./dataset-list.html'),
    styles: [require('./dataset-list.scss')],
})
export class DatasetListComponent implements OnInit, AfterViewInit {
    private datasets: Observable<Dataset[]>;

    static parameters = [Router, FormBuilder, PageTitleService, DatasetService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService) {
        this.datasets = this.datasetService.getDatasets();
    }

    ngOnInit() {
        this.pageTitleService.title = 'Datasets';
    }

    ngAfterViewInit() {
    }
}
