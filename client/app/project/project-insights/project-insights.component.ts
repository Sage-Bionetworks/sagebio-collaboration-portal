import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { InsightService } from '../../insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectInsightsComponent implements AfterViewInit {
    insights: Insight[]
    static parameters = [InsightService];
    constructor(private insightService: InsightService) { }

    ngAfterViewInit() {
        this.insightService.getInsights()
            .subscribe(insights => {
                console.log('insights: ', insights);
                this.insights = insights
            })
    }
}
