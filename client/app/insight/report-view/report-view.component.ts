import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { InsightService } from '../insight.service';
import { Report } from 'models/insights/report.model';

@Component({
    selector: 'report-view',
    template: require('./report-view.html'),
    styles: [require('./report-view.scss')],
})
export class ReportViewComponent {
    private _report: Report;

    static parameters = [Router];
    constructor(private router: Router) { }

    get report() {
        return this._report;
    }

    @Input()
    set report(report) {
        this._report = report;
    }
}
