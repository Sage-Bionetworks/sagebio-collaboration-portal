import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'components/material/material.module';
import { EntityModule } from 'components/entity/entity.module';
import { SocketService } from 'components/socket/socket.service';
import { AuthGuard } from 'components/auth/auth-guard.service';

import { DataCatalogDiscussionComponent } from './data-catalog-discussion/data-catalog-discussion.component';
import { DataCatalogEditComponent } from './data-catalog-edit/data-catalog-edit.component';
import { DataCatalogListComponent } from './data-catalog-list/data-catalog-list.component';
import { DataCatalogNewComponent } from './data-catalog-new/data-catalog-new.component';
import { DataCatalogComponent } from './data-catalog-page/data-catalog.component';
import { DataCatalogService } from './data-catalog.service';
import { ShareModule } from 'components/share/share.module';
import { ClipboardModule } from 'ngx-clipboard';
import { MessagingModule } from 'components/messaging/messaging.module';

export const ROUTES: Routes = [
    {
        path: 'data-catalogs',
        component: DataCatalogListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'data-catalogs/new',
        component: DataCatalogNewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'data-catalogs/:id',
        component: DataCatalogComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'data-catalogs/:id/discussion',
        component: DataCatalogDiscussionComponent,
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
        EntityModule,
        ShareModule,
        ClipboardModule,
        MessagingModule
    ],
    declarations: [
        DataCatalogDiscussionComponent,
        DataCatalogEditComponent,
        DataCatalogListComponent,
        DataCatalogNewComponent,
        DataCatalogComponent,
    ],
    providers: [SocketService, DataCatalogService],
    exports: [],
})
export class DataCatalogModule {}
