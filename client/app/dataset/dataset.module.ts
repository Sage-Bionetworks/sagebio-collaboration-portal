import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

import { DataCatalogModule } from '../data-catalog/data-catalog.module';

import { DatasetListComponent } from './dataset-list/dataset-list.component';
import { DatasetViewComponent } from './dataset-view/dataset-view.component';
import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetSearchComponent } from './dataset-search/dataset-search.component';
import { DatasetService } from './dataset.service';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'datasets', component: DatasetListComponent, data: {} },
    { path: 'datasets/:id', component: DatasetComponent, data: {} }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        DataCatalogModule
        // ImageModule
    ],
    declarations: [
        DatasetListComponent,
        DatasetViewComponent,
        DatasetComponent,
        DatasetSearchComponent
    ],
    providers: [
        SocketService,
        DatasetService
    ],
    exports: [
        DatasetListComponent,
        DatasetViewComponent,
        DatasetComponent,
        DatasetSearchComponent
    ],
})
export class DatasetModule { }
