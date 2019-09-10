import { Component, OnInit } from '@angular/core';
import { InsightService } from 'components/insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import { ProjectDataService } from '../project-data.service';
import { Project } from 'models/entities/project.model';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')],
})
export class ProjectInsightsComponent implements OnInit {
    private project: Project;
    private insightTypeFilters: any; // used in html

    static parameters = [Router, PageTitleService, InsightService, ProjectDataService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private insightService: InsightService, // used in html
        private projectDataService: ProjectDataService
    ) {
        this.insightTypeFilters = config.insightTypeFilters;
    }

    ngOnInit() {
        this.projectDataService.project().subscribe(
            project => {
                if (project) {
                    this.project = project;
                    this.pageTitleService.title = `${project.title} - Insights`;
                }
            },
            err => console.error(err)
        );
    }

    onEntityClick(insight: Insight): void {
        if (insight) {
            this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
        }
    }

    onNewInsightClick(): void {
        if (this.project) {
            this.router.navigate(['/projects', this.project._id, 'insights', 'new']);
        }
    }
}
