import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { EntityModule } from '../../components/entity/entity.module';

import { ProjectComponent } from './project.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectService } from './project.service';
import { ProjectDataService } from './project-data.service';

export const ROUTES: Routes = [{
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'projects/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', redirectTo: 'settings', pathMatch: 'full'},
        { path: 'dashboard', component: ProjectDashboardComponent },
        { path: 'settings', component: ProjectSettingsComponent }
    ]
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        AppQuillModule,
        EntityModule
    ],
    providers: [
        SocketService,
        ProjectService,
        ProjectDataService
    ],
    declarations: [
        ProjectComponent,
        ProjectNewComponent,
        ProjectListComponent,
        ProjectViewComponent,
        ProjectDashboardComponent,
        ProjectSettingsComponent
    ],
    exports: [
    ],
})
export class ProjectModule { }
