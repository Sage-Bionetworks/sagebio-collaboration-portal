import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { Thread } from 'models/messaging/thread.model';
import { ProjectDataService } from '../project-data.service';
import config from '../../app.constants';

@Component({
    selector: 'project-thread-new',
    template: require('./project-thread-new.html'),
    styles: [require('./project-thread-new.scss')],
})
export class ProjectThreadNewComponent implements OnInit {
    private project$: Observable<Project>;
    private entityType: string;

    static parameters = [Router, ProjectDataService];
    constructor(private router: Router, private projectDataService: ProjectDataService) {
        this.entityType = config.entityTypes.PROJECT.value;
    }

    ngOnInit() {
        this.project$ = this.projectDataService.project();
    }

    onNewThread(project: Project, thread: Thread): void {
        if (project && thread) {
            this.router.navigate(['/projects', thread._id]);
        }
    }

    onClose(project: Project): void {
        if (project) {
            this.router.navigate(['/projects', project._id , 'discussion']);
        }
    }
}
