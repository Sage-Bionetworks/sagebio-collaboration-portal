import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { Project } from 'models/entities/project.model';
import { ProjectService } from '../project.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'project-list',
    template: require('./project-list.html'),
    styles: [require('./project-list.scss')],
})
export class ProjectListComponent implements OnInit {
    static parameters = [Router, PageTitleService, NotificationService, ProjectService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService,
        private projectService: ProjectService
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Projects';
    }

    onEntityClick(project: Project) {
        if (project) {
            this.router.navigate(['/projects', project._id]);
        }
    }

    onNewProject(project: Project): void {
        this.notificationService.info('The Project has been successfully created');
    }
}
