import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { QuillModule } from 'ngx-quill';

import { AppQuillModule } from '../../components/quill/app-quill.module';
import { MaterialModule } from '../../components/material/material.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { FiltersModule } from '../../components/filters/filters.module';

import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightViewComponent } from './insight-view/insight-view.component';
import { InsightComponent } from './insight-page/insight.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { ReportViewComponent } from './report-view/report-view.component';

import { InsightService } from './insight.service';
import { SocketService } from '../../components/socket/socket.service';

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
        QuillModule.forRoot({
            modules: {
                imageDrop: true,
                'emoji-shortname': true,
                'emoji-textarea': false,
                'emoji-toolbar': true,
                syntax: true
            },
        }),
        AppQuillModule,
        FiltersModule
    ],
    declarations: [
        InsightListComponent,
        InsightViewComponent,
        InsightComponent,
        DashboardViewComponent,
        ReportViewComponent
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
})
export class InsightModule { }
