import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';
import { ActivityModule } from 'components/activity/activity.module';
import { ProvenanceModule } from 'components/provenance/provenance.module';
import { EntityModule } from 'components/entity/entity.module';

import { ToolComponent } from './tool.component';
import { ToolActivitiesComponent } from './tool-activities/tool-activities.component';
import { ToolDiscussionComponent } from './tool-discussion/tool-discussion.component';
import { ToolHomeComponent } from './tool-home/tool-home.component';
import { ToolEditComponent } from './tool-edit/tool-edit.component';
import { ToolListComponent } from './tool-list/tool-list.component';
import { ToolNewComponent } from './tool-new/tool-new.component';
import { ToolSettingsComponent } from './tool-settings/tool-settings.component';
import { ToolSidenavComponent } from './tool-sidenav/tool-sidenav.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { ToolService } from './tool.service';
import { ToolDataService } from './tool-data.service';
import { ToolSidenavService } from './tool-sidenav/tool-sidenav.service';

export const ROUTES: Routes = [
    {
        path: 'tools',
        component: ToolListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/new',
        component: ToolNewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/:id',
        component: ToolComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: ToolHomeComponent },
            { path: 'activities', component: ToolActivitiesComponent },
            { path: 'discussion', component: ToolDiscussionComponent },
            { path: 'settings', component: ToolSettingsComponent },
        ],
    },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        ActivityModule,
        ProvenanceModule,
        EntityModule,
    ],
    declarations: [
        ToolComponent,
        ToolActivitiesComponent,
        ToolDiscussionComponent,
        ToolHomeComponent,
        ToolEditComponent,
        ToolListComponent,
        ToolNewComponent,
        ToolSettingsComponent,
        ToolSidenavComponent,
        ToolViewComponent,
    ],
    providers: [SocketService, ToolService, ToolDataService, ToolSidenavService],
    exports: [],
})
export class ToolModule {}
