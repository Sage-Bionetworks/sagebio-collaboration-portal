import { Component, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { InsightService } from 'components/insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/project.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')]
})
export class ProjectInsightsComponent implements OnInit {
    private project: Project;
    private insights: Insight[];
    private insightTypeFilters = config.insightTypeFilters;

    static parameters = [InsightService, ProjectDataService];
    constructor(private insightService: InsightService,
        private projectDataService: ProjectDataService) { }

    ngOnInit() {
        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
                const selectedFilter = config.insightTypeFilters.find(filter => filter.active);
                const defaultQuery = { insightType: selectedFilter.value };
                this.onFilterChange(defaultQuery);
            }, err => console.error(err));
    }

    onFilterChange(query) {
        this.insightService.query(this.project, query)
            .subscribe(insights => {
                this.insights = orderBy(insights, 'createdAt', 'asc');
            }, err => {
                console.log(err);
            });
    }
}
