import { Component } from '@angular/core';
// import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'tool-discussion',
    template: require('./tool-discussion.html'),
    styles: [require('./tool-discussion.scss')],
})
export class ToolDiscussionComponent {

    static parameters = [];
    constructor() { }
}
