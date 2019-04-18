import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import { State } from '../../../../shared/interfaces/state.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';

@Component({
    selector: 'state-list',
    template: require('./state-list.html'),
    styles: [require('./state-list.scss')],
})
export class StateListComponent implements OnInit, AfterViewInit {
    private states: Observable<State[]>;

    static parameters = [Router, FormBuilder, PageTitleService, StateService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private stateService: StateService) {
        this.states = this.stateService.getStates();
            // .pipe(
            //     map(posts => orderBy('name', 'asc', posts))
            // );
    }

    ngOnInit() {
        this.pageTitleService.title = 'States';
    }

    ngAfterViewInit() {
    }
}
