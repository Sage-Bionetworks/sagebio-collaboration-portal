import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'entity-view',
    template: require('./entity-view.html'),
    styles: [require('./entity-view.scss')],
})
export class EntityViewComponent {
    private _entity: Insight;
    @Input() entityRoute: string = ''

    static parameters = [Router];
    constructor(private router: Router) { }

    get entity() {
        return this._entity;
    }

    @Input()
    set entity(entity) {
        this._entity = entity;
    }
}
