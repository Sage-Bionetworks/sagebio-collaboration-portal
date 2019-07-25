import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';

import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightViewComponent } from './insight-view/insight-view.component';
import { ShowActivityButtonComponent } from 'components/activity/show-activity-button/show-activity-button.component';
import { ActivitySidenavComponent } from '../../components/activity/insight-activity/insight-activity-sidenav/insight-activity-sidenav.component';
import { InsightComponent } from './insight-page/insight.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { StateViewComponent } from './state-view/state-view.component';

import { InsightService } from './insight.service';
import { SocketService } from 'components/socket/socket.service';

export const ROUTES: Routes = [{
    path: 'insights',
    component: InsightListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'insights/:id',
    component: InsightComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        AppQuillModule,
        FiltersModule
    ],
    declarations: [
        InsightListComponent,
        InsightViewComponent,
        ShowActivityButtonComponent,
        ActivitySidenavComponent,
        InsightComponent,
        DashboardViewComponent,
        ReportViewComponent,
        StateViewComponent
    ],
    providers: [
        SocketService,
        InsightService
    ],
    exports: [
        InsightListComponent,
        InsightViewComponent,
        InsightComponent
    ],
    entryComponents: [
        ActivitySidenavComponent
    ]
})
export class InsightModule { }
