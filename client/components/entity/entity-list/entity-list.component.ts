import { Component, Input, ViewChildren, QueryList, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';

import { Entity } from 'models/entities/entity.model';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';
import { Resource } from 'models/entities/resources/resource.model';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { flow, keyBy, mapValues, capitalize } from 'lodash/fp';
import { map } from 'rxjs/operators';
import { values } from 'lodash/fp';
import { assign } from 'lodash';
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

    private limit = 2;
    private page = 0;
    // private pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    // private searchData: any;
    // private searchPageIndex: number;
    private searchResultCount = 0;
    // private catalogNotReached = false;

    private query: BehaviorSubject<any> = new BehaviorSubject<any>({});

    static parameters = [];
    constructor() {}

    ngOnInit() {
        this.orderFilters = values({
            RELEVANCE: {
                value: 'relevance',
                title: 'Relevance',
                active: true,
            },
            NEWEST: {
                value: '-createdAt',
                title: `Newest ${this.entityName}s`, // assumes plural simply ends with 's'
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
        let previewTypeFilter = this.filters
            .find(f => f.group === 'previewType')
            .getSelectedFilter();

        let selectedFilters = this.filters
            .filter(f => f.group !== 'previewType')
            .map(f => f.getSelectedFilter());

        combineLatest(...selectedFilters)
            .pipe(map(myFilters => flow([keyBy('group'), mapValues('value')])(myFilters)))
            .subscribe(query => {
                this._entities = [];
                this.searchResultCount = 0;
                this.page = 0;
                this.query.next(query);

                // this.query.next(assign(query, {
                //         page: this.page,
                //         limit: this.limit
                //     }
                // ));

                // this._entities = [];
                // query = assign(query, {
                //     page: this.page,
                //     limit: this.limit
                // });
                // console.log('query', query);
                // this.filterChange.emit(query);
            });

        this.query
            .subscribe(query => {
                this.filterChange.emit(query);
            }, err => console.error(err));

        previewTypeFilter
            .pipe(
                map(filter => filter.value)
            )
            .subscribe((previewType: string) => {
                this.previewType = previewType;
            });
    }

    get entityName(): string {
        return capitalize(this._entityName);
    }

    @Input()
    set entityName(entityName: string) {
        this._entityName = entityName;
    }

    get entities(): E[] {
        return this._entities;
    }

    @Input()
    set entities(entities: E[]) {
        console.log('NEW ENTITIES', entities);
        this._entities.push(...entities);
        this.searchResultCount = this._entities.length;
    }

    onEntityClick(entity: E): void {
        this.entityClick.emit(entity);
    }

    showMoreResults(): void {
        let query = assign(
            this.query.getValue(), {
                page: ++this.page,
                limit: this.limit
            }
        );
        console.log('QUERY', query);
        this.query.next(query);
    }
}
