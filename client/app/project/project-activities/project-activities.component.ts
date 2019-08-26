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

@Component({
    selector: 'project-activities',
    template: require('./project-activities.html'),
    styles: [require('./project-activities.scss')],
})
export class ProjectActivitiesComponent implements OnInit, AfterViewInit {
    @ViewChild('plop', { static: false }) container: ElementRef<HTMLElement>; // OR viewContainerRef?
    @ViewChild(MeasurableDirective, { static: false }) measurable: MeasurableDirective;

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

    ngAfterViewInit() {
        // console.log(this.container);
        // console.log(this.container.nativeElement.offsetWidth);
        setTimeout(_ => this.inflate());
    }

    inflate() {
        this.measurable.width()
            .subscribe(width => console.log('WIDTH', width));
        // console.log('measurable', this.measurable.getWidth());
        // let bounds = <ClientRect>this.container.nativeElement.getBoundingClientRect();
        // console.log('BOUND', bounds);
        // if(bounds.bottom > 0 && bounds.top < window.innerHeight) {
        //   this.isLoading = true;
        //   let img = new Image();
        //   img.src = this.url;
        //   img.onload = _=> {
        //     this.isLoaded = true;
        //     this.isLoading = false;
        //     this.renderer.setElementStyle(this.holder,
        //       'background-image', 'url("' + this.url + '")');
        //   };
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
