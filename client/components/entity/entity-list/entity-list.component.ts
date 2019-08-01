import { Component, Input, ViewChildren, QueryList, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';
import { Resource } from 'models/entities/resources/resource.model';
import { combineLatest } from 'rxjs';
import { flow, keyBy, mapValues } from 'lodash/fp';
import { map } from 'rxjs/operators';

@Component({
    selector: 'entity-list',
    template: require('./entity-list.html'),
    styles: [require('./entity-list.scss')],
})
export class EntityListComponent implements AfterViewInit {
    @Input() entityName: string
    @Input() entityRoute: string = ''
    @Input() entityTypeFilters: Filter[] = []
    @Input() filterGroup: string
    @Output() onFilterChange:EventEmitter<string>  = new EventEmitter<string>();
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    _entities: Insight[] | Resource[]  = [];

    static parameters = [];

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
            )
            .subscribe(query => this.onFilterChange.emit(query))
    }

    get entities() {
        return this._entities
    }

    @Input()
    set entities(entities) {
        this._entities = entities
    }
}
