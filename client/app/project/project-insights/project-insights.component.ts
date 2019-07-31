import { Component, OnInit } from '@angular/core';

import { InsightService } from '../../insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import config from '../../../app/app.constants';
import { orderBy } from 'lodash';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')]
})
export class ProjectInsightsComponent implements OnInit {
    private insights: Insight[];
    private insightTypeFilters = config.insightTypeFilters;

    static parameters = [InsightService];
    constructor(private insightService: InsightService) {}

    ngOnInit() {
        const defaultQuery = { insightType: "Report" }
        this.onFilterChange(defaultQuery)
    }

    onFilterChange(query) {
        this.insightService.getInsights(query)
            .subscribe(insights => {
                this.insights = orderBy(insights, 'createdAt', 'asc')
            }, err => {
                console.log(err);
            });
    }
}
