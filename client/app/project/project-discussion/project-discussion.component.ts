import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import config from '../../app.constants';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent {
    private entityType = config.entityTypes.PROJECT.value;
    private entityId = '';

    static parameters = [ProjectDataService];
    constructor(private projectDataService:ProjectDataService,) {}

    ngOnInit() {
        this.projectDataService.project().subscribe(project => {
            try {
                this.entityId = project._id
            } catch (err) {
                // If we do not have an ID to work with, it's fine to leave this as undefined
                console.error(err);
            }
        });
    }
}
