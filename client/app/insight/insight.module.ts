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

import { ShareButtonModule } from 'components/share/share-button/share-button.module';
import { ShareSidenavModule } from 'components/share/share-sidenav/share-sidenav.module';

import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightAppPageComponent } from './insight-app-page/insight-app-page.component';

import { InsightService } from 'components/insight/insight.service';
import { SocketService } from 'components/socket/socket.service';

import { ProvenanceModule } from 'components/provenance/provenance.module';
import { EntityModule } from 'components/entity/entity.module';
import { InsightModule as InsightComponentModule } from 'components/insight/insight.module';

export const ROUTES: Routes = [
    {
        path: 'insights',
        component: InsightListComponent,
        canActivate: [AuthGuard],
        data: {}
    },
    {
        path: 'insights/:insightId',
        component: InsightAppPageComponent,
        canActivate: [AuthGuard],
        data: {}
    }
];

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
        ShareButtonModule,
        ShareSidenavModule,
        ProvenanceModule,
        EntityModule,
        InsightComponentModule
    ],
    declarations: [
        InsightListComponent,
        InsightAppPageComponent,
    ],
    providers: [
        SocketService,
        InsightService
    ],
    exports: [
        InsightListComponent,
    ],
    entryComponents: []
})
export class InsightModule { }
