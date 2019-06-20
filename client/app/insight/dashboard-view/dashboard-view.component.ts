import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InsightService } from '../insight.service';
import { Insight } from '../../../../shared/interfaces/insights/insight.model';

@Component({
    selector: 'insight-view',
    template: require('./insight-view.html'),
    styles: [require('./insight-view.scss')],
})
export class InsightViewComponent {
    private _insight: Insight;

    static parameters = [Router];
    constructor(private router: Router) { }

    get insight() {
        return this._insight;
    }

    @Input()
    set insight(insight) {
        this._insight = insight;
    }
}
