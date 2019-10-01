import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { ProjectDataService } from '../project-data.service';
import { ProjectHeaderService } from '../project-header/project-header.service';
import config from '../../app.constants';

@Component({
    selector: 'project-discussion',
    template: require('./project-discussion.html'),
    styles: [require('./project-discussion.scss')],
})
export class ProjectDiscussionComponent implements OnInit, OnDestroy {
    private project$: Observable<Project>;
    private entityType: string;

    static parameters = [ProjectDataService, ProjectHeaderService];
    constructor(private projectDataService: ProjectDataService, private projectHeaderService: ProjectHeaderService) {
        this.entityType = config.entityTypes.PROJECT.value;
    }

    ngOnInit() {
        this.project$ = this.projectDataService.project();
        this.projectHeaderService.showNewDiscussionButton();
    }

    ngOnDestroy() {
        this.projectHeaderService.hideActionButton();
    }
}
