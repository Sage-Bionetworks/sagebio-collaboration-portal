import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from 'models/project.model';
import { ProjectDataService } from  '../project-data.service';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent {
    private project: Observable<Project>;

    static parameters = [ProjectDataService];
    constructor(
        private projectDataService: ProjectDataService,
    ) {
        this.project = this.projectDataService.project();
     }
}
