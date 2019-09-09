import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'entity-list-item',
    template: require('./entity-list-item.html'),
    styles: [require('./entity-list-item.scss')],
})
export class EntityListItemComponent<E extends Entity> {
    private _entity: E;

    @Output() entityClick: EventEmitter<E> = new EventEmitter<E>();

    static parameters = [];
    constructor() { }

    get entity(): E {
        return this._entity;
    }

    @Input()
    set entity(entity: E) {
        this._entity = entity;
    }

    onEntityClick(): void {
        this.entityClick.emit(this.entity);
    }
}
