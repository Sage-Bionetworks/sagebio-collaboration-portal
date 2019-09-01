import { Component, Input, ViewChildren, QueryList, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';

import { Entity } from 'models/entities/entity.model';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';
import { Resource } from 'models/entities/resources/resource.model';
import { combineLatest } from 'rxjs';
import { flow, keyBy, mapValues, capitalize } from 'lodash/fp';
import { map } from 'rxjs/operators';
import { values } from 'lodash/fp';
import config from '../../../app/app.constants';

@Component({
    selector: 'entity-list',
    template: require('./entity-list.html'),
    styles: [require('./entity-list.scss')],
})
export class EntityListComponent<E extends Entity> implements OnInit, AfterViewInit {
    private _entityName: string;
    @Input() entityTypeFilters: Filter[] = [];
    @Input() entityTypeFilterGroup: string;
    private orderFilters: Filter[] = [];

    _entities: E[]  = [];

    @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    // https://stackoverflow.com/a/50818532

    static parameters = [];
    constructor() {}

    ngOnInit() {
        this.orderFilters = values({
            NEWEST: {
                value: '-createdAt',
                title: `Newest ${this.entityName}`,
                active: true
            },
            OLDEST: {
                value: 'createdAt',
                title: `Oldest ${this.entityName}`,
                active: false
            }
        });
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
            )
            .subscribe(query => this.onFilterChange.emit(query));
    }

    get entityName(): string {
        return capitalize(this._entityName);
    }

    @Input()
    set entityName(entityName: string) {
        this._entityName = entityName;
    }

    get entities() {
        return this._entities;
    }

    @Input()
    set entities(entities) {
        this._entities = entities;
    }
}
