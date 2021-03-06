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
// import { ToolService } from './../tool/tool.service';

import { ProjectComponent } from './project.component';
import { ProjectActivityComponent } from './project-activity/project-activity.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectHeaderComponent } from './project-header/project-header.component';
import { ProjectHomeComponent } from './project-home/project-home.component';
import { ProjectInsightNewComponent } from './project-insight-new/project-insight-new.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDiscussionComponent } from './project-discussion/project-discussion.component';
import { ProjectInsightsComponent } from './project-insights/project-insights.component';
import { ProjectResourcesComponent } from './project-resources/project-resources.component';
import { ProjectResourceNewComponent } from './project-resource-new/project-resource-new.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectSidenavComponent } from './project-sidenav/project-sidenav.component';
import { ProjectService } from './project.service';
import { ProjectDataService } from './project-data.service';
import { ProjectHeaderService } from './project-header/project-header.service';
import { ProjectSidenavService } from './project-sidenav/project-sidenav.service';

import { EntityModule as EntityListModule } from '../../components/entity/entity.module';
import { ShareModule } from 'components/share/share.module';
import { ClipboardModule } from 'ngx-clipboard';
import { ProjectThreadNewComponent } from './project-thread-new/project-thread-new.component';
import { ProjectAuthorizationService } from './project-authorization.service';
import { ProjectGuard } from './project-guard.service';
import { EntityAuthorizationTypes } from 'components/authorization/entity-guard.service';
import { ProjectResourceComponent } from './project-resource/project-resource.component';
import { ProjectInsightComponent } from './project-insight/project-insight.component';
import { ProjectThreadComponent } from './project-thread/project-thread.component';

export const ROUTES: Routes = [
    {
        path: 'projects',
        component: ProjectListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'projects/new',
        component: ProjectNewComponent,
        canActivate: [AuthGuard, ProjectGuard],
        data: { authorization: EntityAuthorizationTypes.CREATE },
    },
    {
        path: 'projects/:id',
        component: ProjectComponent,
        canActivate: [AuthGuard, ProjectGuard],
        data: { authorization: EntityAuthorizationTypes.READ },
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: ProjectHomeComponent },
            { path: 'insights', component: ProjectInsightsComponent },
            {
                path: 'insights/new',
                component: ProjectInsightNewComponent,
                canActivate: [ProjectGuard],
                data: { authorization: EntityAuthorizationTypes.WRITE },
            },
            { path: 'insights/:insightId', component: ProjectInsightComponent },
            { path: 'resources', component: ProjectResourcesComponent },
            {
                path: 'resources/new',
                component: ProjectResourceNewComponent,
                canActivate: [ProjectGuard],
                data: { authorization: EntityAuthorizationTypes.WRITE },
            },
            { path: 'resources/:resourceId', component: ProjectResourceComponent },
            { path: 'activity', component: ProjectActivityComponent },
            { path: 'discussion', component: ProjectDiscussionComponent },
            { path: 'discussion/new', component: ProjectThreadNewComponent },
            { path: 'discussion/:threadId', component: ProjectThreadComponent },
            {
                path: 'settings',
                component: ProjectSettingsComponent,
                canActivate: [ProjectGuard],
                data: { authorization: EntityAuthorizationTypes.ADMIN },
            },
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
        ShareModule,
        ClipboardModule,
    ],
    providers: [
        SocketService,
        // ToolService,
        ProjectService,
        ProjectDataService,
        ProjectAuthorizationService,
        ProjectGuard,
        ProjectHeaderService,
        ProjectSidenavService,
        InsightService,
        ResourceService,
    ],
    declarations: [
        ProjectComponent,
        ProjectActivityComponent,
        ProjectNewComponent,
        ProjectEditComponent,
        ProjectHeaderComponent,
        ProjectHomeComponent,
        ProjectInsightComponent,
        ProjectInsightNewComponent,
        ProjectInsightsComponent,
        ProjectListComponent,
        ProjectDiscussionComponent,
        ProjectResourceComponent,
        ProjectResourceNewComponent,
        ProjectResourcesComponent,
        ProjectSettingsComponent,
        ProjectSidenavComponent,
        ProjectThreadComponent,
        ProjectThreadNewComponent,
    ],
    exports: [],
})
export class ProjectModule {}
