import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

// import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetListComponent } from './dataset-list/dataset-list.component';
// import { DatasetViewComponent } from './dataset-list-item/dataset-list-item.component';

import { DatasetService } from './dataset.service';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
  { path: 'datasets', component: DatasetListComponent, data: {} },
  // { path: 'datasets/:id', component: DatasetComponent, data: {} }
];

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
    // DatasetComponent,
    DatasetListComponent,
    // DatasetViewComponent,
  ],
  providers: [
    SocketService,
    DatasetService
  ],
  exports: [
    DatasetListComponent,
    // DatasetComponent
  ],
})
export class DatasetModule { }
