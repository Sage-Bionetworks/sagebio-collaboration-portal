import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from 'components/resource/resource.service';
import { Resource } from 'models/entities/resources/resource.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { ProjectHeaderService } from '../project-header/project-header.service';

@Component({
    selector: 'project-resources',
    template: require('./project-resources.html'),
    styles: [require('./project-resources.scss')],
})
export class ProjectResourcesComponent implements OnInit, OnDestroy {
    private project: Project;
    private resourceTypeFilters: any; // used in html

    static parameters = [Router, PageTitleService, ResourceService, ProjectDataService, ProjectHeaderService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService, // used in html
        private projectDataService: ProjectDataService,
        private projectHeaderService: ProjectHeaderService
    ) {
        this.resourceTypeFilters = config.resourceTypeFilters;
    }

    ngOnInit() {
        this.projectHeaderService.showNewResourceButton();
        this.projectDataService.project().subscribe(
            project => {
                if (project) {
                    this.project = project;
                    this.pageTitleService.title = `${project.title} - Resources`;
                }
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        this.projectHeaderService.hideActionButton();
    }

    onEntityClick(resource: Resource): void {
        if (resource) {
            this.router.navigate(['/projects', resource.projectId, 'resources', resource._id]);
        }
    }

    onNewResourceClick(): void {
        if (this.project) {
            this.router.navigate(['/projects', this.project._id, 'resources', 'new']);
        }
    }
}
