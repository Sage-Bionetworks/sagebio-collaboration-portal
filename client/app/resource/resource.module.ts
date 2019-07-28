import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';

import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceComponent } from './resource-page/resource.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { StateViewComponent } from './state-view/state-view.component';

import { ResourceService } from './resource.service';
import { SocketService } from 'components/socket/socket.service';

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
        FiltersModule
    ],
    declarations: [
        ResourceListComponent,
        ResourceViewComponent,
        ResourceComponent,
        DashboardViewComponent,
        StateViewComponent
    ],
    providers: [
        SocketService,
        ResourceService
    ],
    exports: [
        ResourceListComponent,
        ResourceViewComponent,
        ResourceComponent
    ],
})
export class ResourceModule { }
