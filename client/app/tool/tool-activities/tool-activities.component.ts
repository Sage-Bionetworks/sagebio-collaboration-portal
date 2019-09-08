import { Component, OnInit, ViewChild } from '@angular/core';

import { Activity } from 'models/provenance/activity.model';
import { Tool } from 'models/entities/tool.model';
import { NotificationService } from 'components/notification/notification.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { ProvenanceGraphComponent } from 'components/provenance/provenance-graph/provenance-graph.component';
import { ResizedEvent } from 'components/directives/resized/resized-event';
import config from '../../app.constants';

import { ToolDataService } from '../tool-data.service';

@Component({
    selector: 'tool-activities',
    template: require('./tool-activities.html'),
    styles: [require('./tool-activities.scss')],
})
export class ToolActivitiesComponent implements OnInit {
    @ViewChild(ProvenanceGraphComponent, { static: false }) provenanceGraph: ProvenanceGraphComponent;

    private tool: Tool;
    private provenanceGraphData: any;
    private activityTypeFilters = config.activityTypeFilters;
    private showNewActivityForm = false;

    static parameters = [ProvenanceService, ToolDataService, NotificationService];
    constructor(private provenanceService: ProvenanceService,
        private toolDataService: ToolDataService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        // this.toolDataService.tool()
        //     .subscribe(tool => {
        //         this.tool = tool;
        //         const selectedFilter = config.activityTypeFilters.find(filter => filter.active);
        //         const defaultQuery = { activityType: selectedFilter.value };
        //         this.onFilterChange(defaultQuery);
        //     }, err => console.error(err));
    }

    onFilterChange(query) {
        if (this.tool) {
            // this.provenanceService.getProvenanceGraph('created_at', 'desc', 10)
            //     .subscribe(activity => {
            //         this.provenanceGraphData = activity;
            //     }, err => {
            //         console.log(err);
            //     });
        }
    }

    onNewActivity(activity: Activity): void {
        // this.showNewActivityForm = false;
        // this.notificationService.info('The Activity has been successfully created');
    }

    onResized(event: ResizedEvent) {
        // if (this.provenanceGraph && event) {
        //     let newHeight = Math.max(Math.min(400, event.newHeight), (9 / 16) * event.newWidth);
        //     this.provenanceGraph.setDimentions(event.newWidth, newHeight);
        // }
    }
}
