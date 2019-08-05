import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';
import { ShowActivityButtonModule } from 'components/activity/show-activity-button/show-activity-button.module';
import { ActivitySidenavModule } from 'components/activity/activity-sidenav/activity-sidenav.module';

import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightViewComponent } from './insight-view/insight-view.component';
// import { InsightComponent } from './insight-page/insight.component';
import { ReportViewComponent } from './report-view/report-view.component';

import { InsightService } from 'components/insight/insight.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceModule } from 'components/provenance/provenance.module';

import { EntityModule } from 'components/entity/entity.module';

export const ROUTES: Routes = [{
    path: 'insights',
    component: InsightListComponent,
    canActivate: [AuthGuard],
    data: {}
// }, {
//     path: 'insights/:id',
//     component: InsightComponent,
//     canActivate: [AuthGuard],
//     data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        AppQuillModule,
        FiltersModule,
        ShowActivityButtonModule,
        ActivitySidenavModule,
        ProvenanceModule,
        EntityModule
    ],
    declarations: [
        InsightListComponent,
        InsightViewComponent,
        // InsightComponent,
        ReportViewComponent,
    ],
    providers: [
        SocketService,
        InsightService
    ],
    exports: [
        InsightListComponent,
        InsightViewComponent
    ],
    entryComponents: []
})
export class InsightModule { }
