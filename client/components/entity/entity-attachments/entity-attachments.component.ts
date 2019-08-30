import { Component, Input } from '@angular/core';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent {
    @Input() entityId: string;

    static parameters = [];
    constructor () {}

}
