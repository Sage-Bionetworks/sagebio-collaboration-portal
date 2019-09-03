import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'entity-list-card',
    template: require('./entity-list-card.html'),
    styles: [require('./entity-list-card.scss')],
})
export class EntityListCardComponent<E extends Entity> {
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
