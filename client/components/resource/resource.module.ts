import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { ActivityModule } from 'components/activity/activity.module';

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
        ActivityModule,
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
