import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../../components/material/material.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { SocketService } from '../../components/socket/socket.service';

import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectComponent } from './project-page/project.component';
import { ProjectService } from './project.service';

export const ROUTES: Routes = [{
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'projects/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        ProjectListComponent,
        ProjectViewComponent,
        ProjectComponent
    ],
    providers: [
        SocketService,
        ProjectService
    ],
    exports: [
    ],
})
export class ProjectModule { }
