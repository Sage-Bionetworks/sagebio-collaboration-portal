import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivityModule } from 'components/activity/activity.module';
import { InsightService } from 'components/insight/insight.service';
import { MaterialModule } from 'components/material/material.module';
import { AppQuillModule } from 'components/quill/app-quill.module';

import { InsightNewComponent } from './insight-new/insight-new.component';
import { InsightPageComponent } from './insight-page/insight-page.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AppQuillModule,
        ActivityModule,
        RouterModule,
    ],
    declarations: [
        InsightNewComponent,
        InsightPageComponent,
    ],
    providers: [
        InsightService
    ],
    exports: [
        InsightNewComponent,
        InsightPageComponent
    ],
    entryComponents: []
})
export class InsightModule { }
