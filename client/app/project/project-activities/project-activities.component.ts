import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ContentChild } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Activity } from 'models/provenance/activity.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';
import config from '../../app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { MeasurableDirective } from 'components/directives/measurable.directive';
import { ProvenanceGraphComponent } from 'components/provenance/provenance-graph/provenance-graph.component';
import { ResizedEvent } from 'angular-resize-event';

@Component({
    selector: 'project-activities',
    template: require('./project-activities.html'),
    styles: [require('./project-activities.scss')],
})
export class ProjectActivitiesComponent implements OnInit, AfterViewInit {
    @ViewChild(MeasurableDirective, { static: false }) measurable: MeasurableDirective;
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

    ngAfterViewInit() {
        // this.measurable.width()
        //     .subscribe(width => {
        //         console.log('WIDTH', width);
        //         this.provenanceGraph.setDimentions(width);
        //     });
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
        console.log('RESIZE EVENT', event);
        if (this.provenanceGraph) {
            this.provenanceGraph.setDimentions(event.newWidth);
        }
    }
}
