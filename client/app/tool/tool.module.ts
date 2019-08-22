import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { ShowActivityButtonModule } from 'components/activity/show-activity-button/show-activity-button.module';
import { ActivitySidenavModule } from 'components/activity/activity-sidenav/activity-sidenav.module';
import { ProvenanceModule } from 'components/provenance/provenance.module';

import { ToolComponent } from './tool-page/tool.component';
import { ToolDiscussionComponent } from './tool-discussion/tool-discussion.component';
import { ToolEditComponent } from './tool-edit/tool-edit.component';
import { ToolListComponent } from './tool-list/tool-list.component';
import { ToolNewComponent } from './tool-new/tool-new.component';
import { ToolViewComponent } from './tool-view/tool-view.component';

import { ToolService } from './tool.service';

export const ROUTES: Routes = [
    {
        path: 'tools',
        component: ToolListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/:slug',
        component: ToolComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/:slug/discussion',
        component: ToolDiscussionComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        ShowActivityButtonModule,
        ActivitySidenavModule,
        ProvenanceModule,
    ],
    declarations: [
        ToolComponent,
        ToolDiscussionComponent,
        ToolEditComponent,
        ToolListComponent,
        ToolNewComponent,
        ToolViewComponent,
    ],
    providers: [SocketService, ToolService],
    exports: [],
})
export class ToolModule {}
