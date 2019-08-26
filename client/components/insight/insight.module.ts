import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { ShareModule } from 'components/share/shareModule';
import { ActivityModule } from 'components/activity/activity.module';
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
        ShareModule,
        ActivityModule,
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
