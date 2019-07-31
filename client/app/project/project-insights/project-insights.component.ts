import { Component, OnInit } from '@angular/core';
import { InsightService } from '../../insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')]
})
export class ProjectInsightsComponent implements OnInit {
    private insights: Insight[];
    static parameters = [InsightService];
    constructor(private insightService: InsightService) { }

    ngOnInit() {
        this.insightService.getInsights()
            .subscribe(insights => {
                console.log('insights: ', insights);
                this.insights = insights;
            });
    }
}
