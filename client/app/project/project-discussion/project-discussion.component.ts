import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import config from '../../app.constants';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent {
    private project$: Observable<Project>;
    private entityType = config.entityTypes.PROJECT.value;

    static parameters = [ProjectDataService];
    constructor(private projectDataService: ProjectDataService) {}

    ngOnInit() {
        this.project$ = this.projectDataService.project();
    }
}
