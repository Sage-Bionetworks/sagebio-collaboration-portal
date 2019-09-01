import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'entity-list-item',
    template: require('./entity-list-item.html'),
    styles: [require('./entity-list-item.scss')],
})
export class EntityListItemComponent<E extends Entity> {
    private _entity: E;

    static parameters = [Router];
    constructor(private router: Router) { }

    get entity(): E {
        return this._entity;
    }

    @Input()
    set entity(entity: E) {
        this._entity = entity;
    }
}
