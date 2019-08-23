import { Component, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Activity } from 'models/provenance/activity.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/project.model';
import config from '../../app.constants';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'project-activities',
    template: require('./project-activities.html'),
    styles: [require('./project-activities.scss')]
})
export class ProjectActivitiesComponent implements OnInit {
    private project: Project;
    private provenanceGraph: any;
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
                    this.provenanceGraph = activity;
                }, err => {
                    console.log(err);
                });
        }
    }

    onNewActivity(activity: Activity): void {
        this.showNewActivityForm = false;
        this.notificationService.info('The Activity has been successfully created');
    }
}
