import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { flow, keyBy, mapValues, values } from 'lodash/fp';

import { Activity } from 'models/provenance/activity.model';
import { Project } from 'models/entities/project.model';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';
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
export class ProjectActivityComponent implements OnInit, AfterViewInit {
    @ViewChild(ProvenanceGraphComponent, { static: false }) provenanceGraph: ProvenanceGraphComponent;
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private activityTypeFilters: Filter[] = [];

    private project: Project;
    private root: BehaviorSubject<Project> = new BehaviorSubject<Project>(undefined);
    private provenanceGraphData: any;
    private showNewActivityForm = false;

    private query: BehaviorSubject<any> = new BehaviorSubject<any>({});

    static parameters = [ProvenanceService, ProjectDataService, NotificationService];
    constructor(
        private provenanceService: ProvenanceService,
        private projectDataService: ProjectDataService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.activityTypeFilters = config.activityTypeFilters;
        this.projectDataService.project()
        .subscribe(project => {
            this.root.next(project);
            this.project = project;
            }, err => console.error(err));
    }

    ngAfterViewInit() {
        console.log('FILTER LENGTH', this.filters.length);
        console.log('this.filters', this.filters);

        let selectedFilters = this.filters
            .map(f => f.getSelectedFilter());

        combineLatest(
            combineLatest(...selectedFilters)
                .pipe(
                    map(myFilters => flow([keyBy('group'), mapValues('value')])(myFilters))
                ),
                this.root.pipe(filter(root => !!root))
        )
            .pipe(
                switchMap(([query, root]) => {
                    console.log('ROOT', root);
                    var filter_str = '*:*';
                    if (query.activityType !== 'all') {
                        filter_str = `class:${query.activityType}`;
                    }
                    return (
                        this.provenanceService.getProvenanceGraphByReference(root._id, 'down', 'created_at', 'desc', 100, filter_str)
                    );
                })
            )
            .subscribe(activity => {
                console.log('ACTIVITY', activity);
                if (activity) {
                    this.provenanceGraphData = activity;
                }
            }, err => console.error(err));
    }

    get root$(): Observable<Project> {
        return this.root.asObservable();
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
