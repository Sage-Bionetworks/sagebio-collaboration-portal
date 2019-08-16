import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';
import { ShowActivityButtonModule } from 'components/activity/show-activity-button/show-activity-button.module';
import { ActivitySidenavModule } from 'components/activity/activity-sidenav/activity-sidenav.module';

import { ResourceListComponent } from './resource-list/resource-list.component';
// TODO: replace imports below with ResourceAppPageComponent
// import { ResourceAppPageComponent } from './resource-app-page/resource-app-page.component';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceComponent } from './resource-page/resource.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { StateViewComponent } from './state-view/state-view.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { WebAppViewComponent } from './webapp-view/webapp-view.component';

import { ResourceService } from './resource.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceModule } from 'components/provenance/provenance.module';

import { EntityModule } from 'components/entity/entity.module';
import { ResourceModule as ResourceComponentModule } from 'components/resource/resource.module';

export const ROUTES: Routes = [{
    path: 'resources',
    component: ResourceListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'resources/:id',
    component: ResourceComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        AppQuillModule,
        FiltersModule,
        ShowActivityButtonModule,
        ActivitySidenavModule,
        ProvenanceModule,
        EntityModule,
        ResourceComponentModule
    ],
    declarations: [
        ResourceListComponent,
        // TODO: replace declarations below with ResourceAppPageComponent
        ResourceViewComponent,
        ResourceComponent,
        DashboardViewComponent,
        ArticleViewComponent,
        WebAppViewComponent,
        StateViewComponent
    ],
    providers: [
        SocketService,
        ResourceService
    ],
    exports: [
        ResourceListComponent,
    ],
})
export class ResourceModule { }
