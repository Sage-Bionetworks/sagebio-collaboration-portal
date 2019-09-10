import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import config from '../../app.constants';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';
import { ProjectHeaderService } from '../project-header/project-header.service';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')]
})
export class ProjectDiscussionComponent implements OnInit, OnDestroy {
    private project$: Observable<Project>;
    private entityType = config.entityTypes.PROJECT.value;

    static parameters = [ProjectDataService, ProjectHeaderService];
    constructor(private projectDataService: ProjectDataService, private projectHeaderService: ProjectHeaderService) {}

    ngOnInit() {
        this.project$ = this.projectDataService.project();
        this.projectHeaderService.showNewDiscussionButton();
    }

    ngOnDestroy() {
        this.projectHeaderService.hideActionButton();
    }
}
