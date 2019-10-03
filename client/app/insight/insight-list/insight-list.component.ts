import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsightService } from 'components/insight/insight.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Insight } from 'models/entities/insights/insight.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'insight-list',
    template: require('./insight-list.html'),
    styles: [require('./insight-list.scss')],
})
export class InsightListComponent implements OnInit {
    private insightTypeFilters = config.insightTypeFilters; // used in html

    static parameters = [Router, PageTitleService, InsightService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private insightService: InsightService // used in html
    ) {
        this.insightTypeFilters = config.insightTypeFilters;
    }

    ngOnInit() {
        this.pageTitleService.setTitle('Insights');
    }

    onEntityClick(insight: Insight) {
        if (insight) {
            this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
        }
    }
}
