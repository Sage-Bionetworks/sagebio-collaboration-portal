import { Component, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { InsightService } from 'components/insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';
import config from '../../../app/app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')],
})
export class ProjectInsightsComponent implements OnInit {
    private project: Project;
    private insights: Insight[];
    private insightTypeFilters = config.insightTypeFilters;
    private showNewInsightForm = false;

    static parameters = [Router, PageTitleService, InsightService, ProjectDataService, NotificationService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private projectDataService: ProjectDataService,
        private notificationService: NotificationService
    ) {
        this.insightTypeFilters = config.insightTypeFilters;
    }

    ngOnInit() {
        this.projectDataService.project()
            .subscribe(project => {
                if (project) {
                    this.pageTitleService.title = `${project.title} - Insights`;
                }
                // this.project = project;
                // const selectedFilter = config.insightTypeFilters.find(filter => filter.active);
                // const defaultQuery = { insightType: selectedFilter.value };
                // this.onFilterChange(defaultQuery);
            }, err => console.error(err));
    }

    // onFilterChange(query) {
    //     if (this.project) {
    //         this.insightService.queryByProject(this.project, query)
    //             .subscribe(insights => {
    //                 this.insights = orderBy(insights, 'createdAt', 'asc');
    //             }, err => {
    //                 console.log(err);
    //             });
    //     }
    // }

    onEntityClick(insight: Insight) {
        if (insight) {
            this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
        }
    }

    onNewInsight(insight: Insight): void {
        this.showNewInsightForm = false;
        this.notificationService.info('The Insight has been successfully created');
    }
}
