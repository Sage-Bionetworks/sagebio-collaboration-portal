import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { Project } from 'models/entities/project.model';
import { ProjectService } from '../project.service';

@Component({
    selector: 'project-list',
    template: require('./project-list.html'),
    styles: [require('./project-list.scss')],
})
export class ProjectListComponent implements OnInit {
    private canCreateProject = false; // used in html

    static parameters = [Router, PageTitleService, UserPermissionDataService, ProjectService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private permissionDataService: UserPermissionDataService,
        private projectService: ProjectService // used in html
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Projects';
        this.permissionDataService
            .permissions()
            .subscribe(
                permissions => (this.canCreateProject = permissions.canCreateProject()),
                err => console.error(err)
            ); // unsubscribe in destructor
    }

    onEntityClick(project: Project) {
        if (project) {
            this.router.navigate(['/projects', project._id]);
        }
    }

    onCreateNewProject(): void {
        if (this.canCreateProject) {
            this.router.navigate(['/', 'projects', 'new']);
        }
    }
}
