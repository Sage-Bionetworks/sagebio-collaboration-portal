import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';
import { ActivityModule } from 'components/activity/activity.module';

import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceAppPageComponent } from './resource-app-page/resource-app-page.component';

import { ResourceService } from 'components/resource/resource.service';
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
    path: 'resources/:resourceId',
    component: ResourceAppPageComponent,
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
        ActivityModule,
        ProvenanceModule,
        EntityModule,
        ResourceComponentModule
    ],
    declarations: [
        ResourceListComponent,
        ResourceAppPageComponent
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
