import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';

@Component({
    selector: 'data-catalog-list',
    template: require('./data-catalog-list.html'),
    styles: [require('./data-catalog-list.scss')],
})
export class DataCatalogListComponent implements OnInit, AfterViewInit {
    private dataCatalogs: Observable<DataCatalog[]>;

    static parameters = [Router, FormBuilder, PageTitleService, DataCatalogService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private dataCatalogService: DataCatalogService) {
        this.dataCatalogs = this.dataCatalogService.getDataCatalogs();
    }

    ngOnInit() {
        this.pageTitleService.title = 'Data Catalogs';
    }

    ngAfterViewInit() {
    }
}
