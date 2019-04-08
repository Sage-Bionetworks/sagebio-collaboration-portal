import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit, AfterViewInit {
    private tools: Observable<Tool[]>;

    static parameters = [Router, FormBuilder, PageTitleService, ToolService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService) {
        this.tools = this.toolService.getTools();
    }

    ngOnInit() {
        this.pageTitleService.title = 'Tools';
    }

    ngAfterViewInit() {
    }
}
