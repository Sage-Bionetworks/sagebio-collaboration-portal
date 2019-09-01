import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ResourceService } from 'components/resource/resource.service';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { orderBy } from 'lodash/fp';
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

    static parameters = [PageTitleService, ResourceService,
        NotificationService];
    constructor(private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private notificationService: NotificationService) {

        this.resourceTypeFilters = config.resourceTypeFilters;
    }

    ngOnInit() {
        this.pageTitleService.title = 'Resources';
    }

    onFilterChange(query) {
        this.resourceService.getResources(query)
            .subscribe(resources => {
                this.resources = orderBy('createdAt', 'asc', resources);
            }, err => {
                console.log(err);
            });
    }

    // clearResults(): void {
    //     this.resources = [];
    //     this.searchResultCount = 0;
    //     this.searchPageIndex = undefined;
    // }
}
