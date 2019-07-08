import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

import { DataCatalogListComponent } from './data-catalog-list/data-catalog-list.component';
import { DataCatalogViewComponent } from './data-catalog-view/data-catalog-view.component';
import { DataCatalogComponent } from './data-catalog-page/data-catalog.component';

import { DataCatalogService } from './data-catalog.service';
import { SocketService } from 'components/socket/socket.service';
import { AuthGuard } from 'components/auth/auth-guard.service';

export const ROUTES: Routes = [{
    path: 'data-catalogs',
    component: DataCatalogListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'data-catalogs/:slug',
    component: DataCatalogComponent,
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
        // ImageModule
    ],
    declarations: [
        DataCatalogListComponent,
        DataCatalogViewComponent,
        DataCatalogComponent
    ],
    providers: [
        SocketService,
        DataCatalogService
    ],
    exports: [
        DataCatalogListComponent,
        DataCatalogViewComponent,
        DataCatalogComponent
    ],
})
export class DataCatalogModule { }
