import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { ResourceService } from '../resource.service';
import { Dashboard } from 'models/resources/dashboard.model';

@Component({
    selector: 'dashboard-view',
    template: require('./dashboard-view.html'),
    styles: [require('./dashboard-view.scss')],
})
export class DashboardViewComponent {
    private _dashboard: Dashboard;

    static parameters = [Router];
    constructor(private router: Router) { }

    get dashboard() {
        return this._dashboard;
    }

    @Input()
    set dashboard(dashboard) {
        this._dashboard = dashboard;
        console.log('DASHBOARD', dashboard);
    }

    openDashboard(): void {
        window.open(this.dashboard.url, '_blank');
    }
}
