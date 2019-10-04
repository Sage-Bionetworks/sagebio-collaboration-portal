import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { ProjectService } from '../project.service';
import { ProjectAuthorizationService } from './../project-authorization.service';

@Component({
    selector: 'project-list',
    template: require('./project-list.html'),
    styles: [require('./project-list.scss')],
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private canCreateProject = false;
    private canCreateProjectSub: Subscription;

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

        this.canCreateProjectSub = this.projectAuthorizationService.canCreate().subscribe(
            canCreate => {
                this.canCreateProject = canCreate;
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        if (this.canCreateProjectSub) {
            this.canCreateProjectSub.unsubscribe();
        }
    }

    onEntityClick(project: Project) {
        if (project) {
            this.router.navigate(['/', 'projects', project._id]);
        }
    }

    newProject(): void {
        if (this.canCreateProject) {
            this.router.navigate(['/', 'projects', 'new']);
        } else {
            this.notificationService.info(`You don't have permission to create a Project.`);
        }
    }
}
