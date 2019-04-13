import { Component, ViewChild, forwardRef } from '@angular/core';
import { MatRadioChange } from '@angular/material';
import { FiltersComponent } from '../filters.component';

@Component({
    selector: 'radio-button-filter',
    template: require('./radio-button-filter.html'),
    styles: [require('./radio-button-filter.scss')],
    providers: [{ provide: FiltersComponent, useExisting: forwardRef(() => RadioButtonFilterComponent) }]
})
export class RadioButtonFilterComponent extends FiltersComponent {

    static parameters = [];
    constructor() {
        super();
    }

    ngOnInit() {
        this.changeFilter.next(this.getSelection());
    }

    select(event: MatRadioChange): void {
        this.changeFilter.next({
            group: this.group,
            value: event.value
        });
    }

    getSelection(): any {
        return {
            group: this.group,
            value: Array.isArray(this.filters) && this.filters.length > 0
                ? this.filters.find(f => f.active).value
                : undefined
        };
    }
}
