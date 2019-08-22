import { Component, Input } from '@angular/core';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'entity-discussion',
    template: require('./entity-discussion.html'),
    styles: [require('./entity-discussion.scss')],
})
export class EntityDiscussionComponent {
    @Input() entity: Entity;

    static parameters = [];
    constructor() { }
}
