import { Component, forwardRef } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';
import { FiltersComponent } from '../filters.component';

@Component({
    selector: 'button-toggle-filter',
    template: require('./button-toggle-filter.html'),
    styles: [require('./button-toggle-filter.scss')],
    providers: [{ provide: FiltersComponent, useExisting: forwardRef(() => ButtonToggleFilterComponent) }],
})
export class ButtonToggleFilterComponent extends FiltersComponent {
    static parameters = [];
    constructor() {
        super();
    }

    ngOnInit() {
        this.changeFilter.next(this.getSelection());
    }

    select(event: MatButtonToggleChange): void {
        this.changeFilter.next({
            group: this.group,
            value: event.value,
        });
    }

    getSelection(): any {
        return {
            group: this.group,
            value:
                Array.isArray(this.filters) && this.filters.length > 0
                    ? this.filters.find(f => f.active).value
                    : undefined,
        };
    }
}
