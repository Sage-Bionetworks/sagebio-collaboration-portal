import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightViewComponent } from './insight-view/insight-view.component';
import { InsightComponent } from './insight-page/insight.component';

import { InsightService } from './insight.service';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'insights', component: InsightListComponent, data: {} },
    { path: 'insights/:id', component: InsightComponent, data: {} }
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
        InsightListComponent,
        InsightViewComponent,
        InsightComponent
    ],
    providers: [
        SocketService,
        InsightService
    ],
    exports: [
        InsightListComponent,
        InsightViewComponent,
        InsightComponent
    ],
})
export class InsightModule { }
