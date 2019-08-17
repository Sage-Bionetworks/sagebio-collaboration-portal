import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { ShowActivityButtonModule } from 'components/activity/show-activity-button/show-activity-button.module';
import { ActivitySidenavModule } from 'components/activity/activity-sidenav/activity-sidenav.module';

import { ResourcePageComponent } from './resource-page/resource-page.component';
import { ResourceNewComponent } from './resource-new/resource-new.component';

import { ResourceService } from 'components/resource/resource.service';
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
        ResourcePageComponent,
        ResourceNewComponent,
    ],
    providers: [
        ResourceService
    ],
    exports: [
        ResourcePageComponent,
        ResourceNewComponent,
    ],
    entryComponents: []
})
export class ResourceModule { }