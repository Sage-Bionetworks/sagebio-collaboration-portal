import { Component, Input, ViewChildren, QueryList, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';

import { Entity } from 'models/entities/entity.model';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';
import { Resource } from 'models/entities/resources/resource.model';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { flow, keyBy, mapValues, capitalize } from 'lodash/fp';
import { map, switchMap } from 'rxjs/operators';
import { values } from 'lodash/fp';
import { assign } from 'lodash';
import config from '../../../app/app.constants';
import { EntityService } from '../entity.service';

@Component({
    selector: 'entity-list',
    template: require('./entity-list.html'),
    styles: [require('./entity-list.scss')],
})
export class EntityListComponent<E extends Entity> implements OnInit, AfterViewInit {
    private _entityName: string;
    @Input() entityService: EntityService<E>;
    @Input() entityTypeFilters: Filter[] = [];
    @Input() entityTypeFilterGroup: string;
    private orderFilters: Filter[] = [];
    private previewTypeFilters: Filter[] = [];
    @Input() previewType = 'array';

    private entities: E[] = [];

    @Output() entityClick: EventEmitter<E> = new EventEmitter<E>();
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    private limit = 2;
    private page = 0;
    private searchResultsCount = 0;

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
                this.entities = [];
                this.searchResultsCount = 0;
                this.page = 0;
                this.query.next(query);
            });

        this.query
            .pipe(
                switchMap(query => this.entityService.query(query))
            )
            .subscribe(res => {
                this.searchResultsCount = res.count;
                this.entities.push(...res.results);
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
        this.query.next(query);
    }
}
