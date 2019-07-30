import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import config from '../../app.constants';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent {
    private entityType = config.entityTypes.PROJECT.value;
    static parameters = [];
    constructor() {

    }
}
