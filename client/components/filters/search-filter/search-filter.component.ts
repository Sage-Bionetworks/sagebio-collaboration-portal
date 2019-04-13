import { Component, forwardRef } from '@angular/core';
import { ActiveFilter } from '../active-filter.model';
import { FiltersComponent } from '../filters.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';

@Component({
    selector: 'search-filter',
    template: require('./search-filter.html'),
    styles: [require('./search-filter.scss')],
    providers: [{ provide: FiltersComponent, useExisting: forwardRef(() => SearchFilterComponent) }]
})
export class SearchFilterComponent extends FiltersComponent {
    private searchForm: FormGroup;
    private searchSub: Subscription;

    static parameters = [FormBuilder];
    constructor(private formBuilder: FormBuilder) {
        super();
        this.searchForm = this.formBuilder.group({
            search: ['', []]
        });
    }

    ngOnInit() {
        this.changeFilter.next(this.getSelection());
        this.searchSub = this.searchForm.controls.search.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe(
                term => this.changeFilter.next(this.getSelection()),
                err => console.log(err)
            );
    }

    ngOnDestroy() {
        this.searchSub.unsubscribe();
    }

    getSelection(): ActiveFilter {
        return {
            group: this.group,
            value: this.searchForm.value.search
        };
    }

    emitSearchTerms(): void {
        this.changeFilter.next(this.getSelection());
    }
}
