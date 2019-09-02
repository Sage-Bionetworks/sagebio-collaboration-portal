import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from 'components/resource/resource.service';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { orderBy, pick } from 'lodash/fp';
import { Resource } from 'models/entities/resources/resource.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'resource-list',
    template: require('./resource-list.html'),
    styles: [require('./resource-list.scss')],
})
export class ResourceListComponent implements OnInit {
    private resources: Resource[] = [];
    private resourceTypeFilters = config.resourceTypeFilters;

    // private searchPageIndex: number;
    // private searchResultCount = 0;

    static parameters = [Router, PageTitleService, ResourceService, NotificationService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private notificationService: NotificationService
    ) {
        this.resourceTypeFilters = config.resourceTypeFilters;
    }

    ngOnInit() {
        this.pageTitleService.title = 'resources';
    }

    onFilterChange(query) {
        console.log('Filter has changed', query);
        // query = pick(['resourceType', 'orderedBy', 'searchTerms'], query);
        // query.page = 0;
        // query.limit = 2;

        this.resourceService.getResources(query)
            .subscribe(resources => {
                this.resources = resources;
                console.log('resources received', resources);
            },
            err => console.error(err));
    }

    onEntityClick(resource: Resource) {
        if (resource) {
            this.router.navigate(['/projects', resource.projectId, 'resources', resource._id]);
        }
    }
}
