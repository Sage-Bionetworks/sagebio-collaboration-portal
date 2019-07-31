import { Component, OnInit, OnChanges, Input, ViewChildren, QueryList } from '@angular/core';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'entity-list',
    template: require('./entity-list.html'),
    styles: [require('./entity-list.scss')],
})
export class EntityListComponent implements OnInit, OnChanges {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    _entities: Insight[] = [];

    private insightTypeFilters: Filter[] = [];

    static parameters = [
      PageTitleService,
      NotificationService
    ];
    constructor(private pageTitleService: PageTitleService) {
        this.insightTypeFilters = config.insightTypeFilters;
    }

    ngOnInit() {
        this.pageTitleService.title = 'Insights';
    }

    ngOnChanges(changes: any) {
        console.log('this.entities: ', this.entities);
    }

    get entities() {
        return this._entities
    }

    @Input()
    set entities(entities) {
        this._entities = entities
    }
}
