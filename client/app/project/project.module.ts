import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FiltersModule } from 'components/filters/filters.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { EntityModule } from 'components/entity/entity.module';
import { MessagingModule } from 'components/messaging/messaging.module';
import { DirectivesModule } from 'components/directives/directives.module';
import { InsightService } from 'components/insight/insight.service';
import { InsightModule } from 'components/insight/insight.module';
import { InsightPageComponent } from 'components/insight/insight-page/insight-page.component';
import { ResourceService } from 'components/resource/resource.service';
import { ResourcePageComponent } from 'components/resource/resource-page/resource-page.component';
import { ResourceModule } from 'components/resource/resource.module';
import { ActivityModule } from 'components/activity/activity.module';
import { ProvenanceModule } from 'components/provenance/provenance.module';

import { ProjectComponent } from './project.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectDiscussionComponent } from './project-discussion/project-discussion.component';
import { ProjectInsightsComponent } from './project-insights/project-insights.component';
import { ProjectResourcesComponent } from './project-resources/project-resources.component';
import { ProjectActivitiesComponent } from './project-activities/project-activities.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectSidenavComponent } from './project-sidenav/project-sidenav.component';
import { ProjectService } from './project.service';
import { ProjectDataService } from './project-data.service';
import { ProjectSidenavService } from './project-sidenav/project-sidenav.service';
import { ProjectGuard } from './project-guard.service';

import { EntityModule as EntityListModule } from '../../components/entity/entity.module';

export const ROUTES: Routes = [
    {
        path: 'projects',
        component: ProjectListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'projects/new',
        component: ProjectNewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'projects/:id',
        component: ProjectComponent,
        canActivate: [AuthGuard, ProjectGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: ProjectDashboardComponent },
            { path: 'insights', component: ProjectInsightsComponent },
            { path: 'insights/:insightId', component: InsightPageComponent },
            { path: 'resources', component: ProjectResourcesComponent },
            { path: 'resources/:resourceId', component: ResourcePageComponent },
            { path: 'activities', component: ProjectActivitiesComponent },
            { path: 'discussion', component: ProjectDiscussionComponent },
            { path: 'settings', component: ProjectSettingsComponent },
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
        // AngularResizedEventModule,
        AppQuillModule,
        EntityModule,
        MessagingModule,
        EntityListModule,
        InsightModule,
        ResourceModule,
        ActivityModule,
        ProvenanceModule,
        FiltersModule,
        DirectivesModule,
    ],
    providers: [
        SocketService,
        ProjectService,
        ProjectDataService,
        ProjectSidenavService,
        ProjectGuard,
        InsightService,
        ResourceService,
    ],
    declarations: [
        ProjectComponent,
        ProjectNewComponent,
        ProjectEditComponent,
        ProjectListComponent,
        ProjectViewComponent,
        ProjectDashboardComponent,
        ProjectDiscussionComponent,
        ProjectInsightsComponent,
        ProjectResourcesComponent,
        ProjectActivitiesComponent,
        ProjectSettingsComponent,
        ProjectSidenavComponent,
    ],
    exports: [],
})
export class ProjectModule {}
