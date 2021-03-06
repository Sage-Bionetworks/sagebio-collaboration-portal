import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { ShareModule } from 'components/share/share.module';
import { ShareService } from 'components/share/share.service';
import { ActivityModule } from 'components/activity/activity.module';
import { InsightService } from 'components/insight/insight.service';
import { MaterialModule } from 'components/material/material.module';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { PipesModule } from 'components/pipes/pipes.module';
import { EntityModule } from 'components/entity/entity.module';

import { InsightEditComponent } from './insight-edit/insight-edit.component';
import { InsightNewComponent } from './insight-new/insight-new.component';
import { InsightPageComponent } from './insight-page/insight-page.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AppQuillModule,
        ShareModule,
        ActivityModule,
        EntityModule,
        RouterModule,
        PipesModule,
        ClipboardModule
    ],
    declarations: [
        InsightEditComponent,
        InsightNewComponent,
        InsightPageComponent,
    ],
    providers: [
        InsightService,
        ShareService,
    ],
    exports: [
        InsightNewComponent,
        InsightPageComponent
    ],
    entryComponents: []
})
export class InsightModule { }
