import { Component, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { ResourceService } from 'components/resource/resource.service';
import { Resource } from 'models/entities/resources/resource.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/project.model';
import config from '../../../app/app.constants';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'project-resources',
    template: require('./project-resources.html'),
    styles: [require('./project-resources.scss')]
})
export class ProjectResourcesComponent implements OnInit {
    private project: Project;
    private resources: Resource[];
    private resourceTypeFilters = config.resourceTypeFilters;
    private showNewResourceForm = false;

    static parameters = [ResourceService, ProjectDataService, NotificationService];
    constructor(private resourceService: ResourceService,
        private projectDataService: ProjectDataService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
                const selectedFilter = config.resourceTypeFilters.find(filter => filter.active);
                const defaultQuery = { resourceType: selectedFilter.value };
                this.onFilterChange(defaultQuery);
            }, err => console.error(err));
    }

    onFilterChange(query) {
        if (this.project) {
            this.resourceService.query(this.project, query)
                .subscribe(resources => {
                    this.resources = orderBy(resources, 'createdAt', 'asc');
                }, err => {
                    console.log(err);
                });
        }
    }

    onNewResource(resource: Resource): void {
        this.showNewResourceForm = false;
        this.notificationService.info('The Resource has been successfully created');
    }
}
