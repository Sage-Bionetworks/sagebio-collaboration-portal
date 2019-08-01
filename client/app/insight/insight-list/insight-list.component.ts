import { Component, OnInit, ViewChild } from '@angular/core';
import { InsightService } from 'components/insight/insight.service';
import { InsightNewComponent } from '../insight-new/insight-new.component';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { orderBy } from 'lodash/fp';
import { Insight } from 'models/entities/insights/insight.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'insight-list',
    template: require('./insight-list.html'),
    styles: [require('./insight-list.scss')],
})
export class InsightListComponent implements OnInit {
    private insights: Insight[] = [];
    private insightTypeFilters = config.insightTypeFilters;

    @ViewChild(InsightNewComponent, { static: false }) newInsight: InsightNewComponent;
    private createNewInsight = false;

    private searchPageIndex: number;
    private searchResultCount = 0;

    static parameters = [PageTitleService, InsightService,
        NotificationService];
    constructor(private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.pageTitleService.title = 'Insights';
    }

    onFilterChange(query) {
        this.insightService.getAll(query)
            .subscribe(insights => {
                this.insights = orderBy('createdAt', 'asc', insights);
            }, err => {
                console.log(err);
            });
    }

    onNewInsight(insight: Insight): void {
        this.createNewInsight = false;
        this.notificationService.info('The Insight has been successfully created');
    }

    clearResults(): void {
        this.insights = [];
        this.searchResultCount = 0;
        this.searchPageIndex = undefined;
    }
}
