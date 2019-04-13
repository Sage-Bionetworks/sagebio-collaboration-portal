import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material';
import { FiltersComponent } from '../filters.component';
import { ActiveFilter } from '../active-filter.model';

@Component({
    selector: 'select-filter',
    template: require('./select-filter.html'),
    styles: [require('./select-filter.scss')],
    providers: [{ provide: FiltersComponent, useExisting: forwardRef(() => SelectFilterComponent) }]
})
export class SelectFilterComponent extends FiltersComponent implements OnInit {
    @ViewChild(MatSelect) mySelect: MatSelect;

    static parameters = [];
    constructor() {
        super();
    }

    ngOnInit() {
        this.mySelect.value = this.filters.find(f => f.active).value;
        this.changeFilter.next(this.getSelection());
    }

    select(event: MatSelectChange): void {
        this.changeFilter.next({
            group: this.group,
            value: event.value
        });
    }

    getSelection(): ActiveFilter {
        return {
            group: this.group,
            value: this.mySelect.value
        };
    }
}
