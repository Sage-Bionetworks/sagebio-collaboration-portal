import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { ShowActivityButtonModule } from 'components/activity/show-activity-button/show-activity-button.module';
import { ActivitySidenavModule } from 'components/activity/activity-sidenav/activity-sidenav.module';

import { InsightPageComponent } from './insight-page/insight-page.component';
import { InsightNewComponent } from './insight-new/insight-new.component';

import { InsightService } from 'components/insight/insight.service';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AppQuillModule,
        ShowActivityButtonModule,
        ActivitySidenavModule,
        RouterModule,
    ],
    declarations: [
        InsightPageComponent,
        InsightNewComponent,
    ],
    providers: [
        InsightService
    ],
    exports: [
        InsightPageComponent,
        InsightNewComponent,
    ],
    entryComponents: []
})
export class InsightModule { }
