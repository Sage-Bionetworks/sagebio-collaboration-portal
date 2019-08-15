import { Component } from '@angular/core';
import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'insight-app-page',
    template: require('./insight-app-page.html'),
    styles: [require('./insight-app-page.scss')],
})
export class InsightAppPageComponent {
  private insight: Insight

  setInsight(insight: Insight) {
    this.insight = insight
  }
}
