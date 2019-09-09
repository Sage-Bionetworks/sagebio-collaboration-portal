import { Component, OnInit, ViewChild } from '@angular/core';

import { Activity } from 'models/provenance/activity.model';
import { Project } from 'models/entities/project.model';
import { NotificationService } from 'components/notification/notification.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { ProvenanceGraphComponent } from 'components/provenance/provenance-graph/provenance-graph.component';
import { ResizedEvent } from 'components/directives/resized/resized-event';
import config from '../../app.constants';

import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-activity',
    template: require('./project-activity.html'),
    styles: [require('./project-activity.scss')],
})
export class ProjectActivityComponent implements OnInit {
    @ViewChild(ProvenanceGraphComponent, { static: false }) provenanceGraph: ProvenanceGraphComponent;

    private project: Project;
    private provenanceGraphData: any;
    private activityTypeFilters = config.activityTypeFilters;
    private showNewActivityForm = false;

    static parameters = [ProvenanceService, ProjectDataService, NotificationService];
    constructor(private provenanceService: ProvenanceService,
        private projectDataService: ProjectDataService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
                const selectedFilter = config.activityTypeFilters.find(filter => filter.active);
                const defaultQuery = { activityType: selectedFilter.value };
                this.onFilterChange(defaultQuery);
            }, err => console.error(err));
    }

    onFilterChange(query) {
        if (this.project) {
            this.provenanceService.getProvenanceGraph('created_at', 'desc', 10)
                .subscribe(activity => {
                    this.provenanceGraphData = activity;
                }, err => {
                    console.log(err);
                });
        }
    }

    onNewActivity(activity: Activity): void {
        this.showNewActivityForm = false;
        this.notificationService.info('The Activity has been successfully created');
    }

    onResized(event: ResizedEvent) {
        if (this.provenanceGraph && event) {
            let newHeight = Math.max(Math.min(400, event.newHeight), (9 / 16) * event.newWidth);
            this.provenanceGraph.setDimentions(event.newWidth, newHeight);
        }
    }
}
