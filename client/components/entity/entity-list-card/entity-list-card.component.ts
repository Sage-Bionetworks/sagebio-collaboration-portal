import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'entity-list-card',
    template: require('./entity-list-card.html'),
    styles: [require('./entity-list-card.scss')],
})
export class EntityListCardComponent<E extends Entity> {
    private _entity: E;

    @Output() entityClick: EventEmitter<E> = new EventEmitter<E>();

    static parameters = [];
    constructor() {}

    get entity(): E {
        return this._entity;
    }

    @Input()
    set entity(entity: E) {
        console.log('ENTITY', entity);
        this._entity = entity;
    }

    onEntityClick(): void {
        this.entityClick.emit(this.entity);
    }
}
