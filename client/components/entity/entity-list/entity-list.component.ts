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
    private previewTypeFilters: Filter[] = [];
    @Input() previewType = 'array';

    _entities: E[] = [];

    @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() entityClick: EventEmitter<E> = new EventEmitter<E>();
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    // https://stackoverflow.com/a/50818532

    // private numDatasetsPerPage = 8;
    // private searchData: any;
    // private searchPageIndex: number;
    private searchResultCount = 0;
    // private catalogNotReached = false;

    static parameters = [];
    constructor() {}

    ngOnInit() {
        this.orderFilters = values({
            NEWEST: {
                value: '-createdAt',
                title: `Newest ${this.entityName}s`, // assumes plural simply ends with 's'
                active: true,
            },
            OLDEST: {
                value: 'createdAt',
                title: `Oldest ${this.entityName}s`, // assumes plural simply ends with 's'
            },
        });

        this.previewTypeFilters = values({
            ARRAY: {
                value: 'array',
                title: 'Array',
                icon: 'view_array',
                active: this.previewType === 'array',
            },
            LIST: {
                value: 'list',
                title: 'List',
                icon: 'view_list',
                active: this.previewType === 'list',
            },
        });
    }

    ngAfterViewInit() {
        let selectedFilters = this.filters.map(f => f.getSelectedFilter());
        combineLatest(...selectedFilters)
            .pipe(map(myFilters => flow([keyBy('group'), mapValues('value')])(myFilters)))
            .subscribe(query => {
                this.previewType = query && query.previewType;
                this.filterChange.emit(query);
            });
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
        this.searchResultCount = entities ? entities.length : 0;
    }

    onEntityClick(entity: E): void {
        this.entityClick.emit(entity);
    }
}
