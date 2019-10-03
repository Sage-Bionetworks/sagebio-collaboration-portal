import { ProjectAuthorizationService, ProjectAuthorization } from './../project-authorization.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Project } from 'models/entities/project.model';
import { ProjectService } from '../project.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'project-list',
    template: require('./project-list.html'),
    styles: [require('./project-list.scss')],
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private projectAuthorization: ProjectAuthorization;
    private projectAuthorizationSub: Subscription;

    static parameters = [Router, PageTitleService, NotificationService, ProjectService, ProjectAuthorizationService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService,
        private projectService: ProjectService, // used in html
        private projectAuthorizationService: ProjectAuthorizationService
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Projects';
        this.projectAuthorizationSub = this.projectAuthorizationService.authorization().subscribe(
            auth => {
                this.projectAuthorization = auth;
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        if (this.projectAuthorizationSub) {
            this.projectAuthorizationSub.unsubscribe();
        }
    }

    onEntityClick(project: Project) {
        if (project) {
            this.router.navigate(['/', 'projects', project._id]);
        }
    }

    newProject(): void {
        if (this.projectAuthorization.canCreate) {
            this.router.navigate(['/', 'projects', 'new']);
        } else {
            this.notificationService.info(`You don't have permission to create a Project.`);
        }
    }
}
