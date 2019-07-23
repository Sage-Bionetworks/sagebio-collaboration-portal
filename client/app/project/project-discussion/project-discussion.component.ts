import { Component } from '@angular/core';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent {

    static parameters = [];
    constructor() { }
}
