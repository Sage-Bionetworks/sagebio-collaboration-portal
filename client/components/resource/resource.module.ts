import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { ActivityModule } from 'components/activity/activity.module';
import { ShareModule } from 'components/share/share.module';
import { PipesModule } from 'components/pipes/pipes.module';
// import { ToolService } from 'client/app/tool/tool.service';

import { ResourceNewComponent } from './resource-new/resource-new.component';
import { ResourceEditComponent } from './resource-edit/resource-edit.component';
import { ResourcePageComponent } from './resource-page/resource-page.component';

import { ResourceService } from 'components/resource/resource.service';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        MaterialModule,
        AppQuillModule,
        ActivityModule,
        RouterModule,
        ShareModule,
        PipesModule,
    ],
    declarations: [ResourceEditComponent, ResourceNewComponent, ResourcePageComponent],
    providers: [ResourceService],
    exports: [ResourcePageComponent, ResourceNewComponent],
    entryComponents: [],
})
export class ResourceModule {}
