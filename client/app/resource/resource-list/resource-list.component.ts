import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from 'components/resource/resource.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Resource } from 'models/entities/resources/resource.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'resource-list',
    template: require('./resource-list.html'),
    styles: [require('./resource-list.scss')],
})
export class ResourceListComponent implements OnInit {
    private resourceTypeFilters = config.resourceTypeFilters;

    static parameters = [Router, PageTitleService, ResourceService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService
    ) {
        this.resourceTypeFilters = config.resourceTypeFilters;
    }

    ngOnInit() {
        this.pageTitleService.title = 'Resources';
    }

    onEntityClick(resource: Resource) {
        if (resource) {
            this.router.navigate(['/projects', resource.projectId, 'resources', resource._id]);
        }
    }
}
