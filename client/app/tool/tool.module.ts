import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

import { ToolListComponent } from './tool-list/tool-list.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { ToolComponent } from './tool-page/tool.component';

import { ToolService } from './tool.service';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'tools', component: ToolListComponent, data: {} },
    { path: 'tools/:id', component: ToolComponent, data: {} }
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
        ToolListComponent,
        ToolViewComponent,
        ToolComponent
    ],
    providers: [
        SocketService,
        ToolService
    ],
    exports: [
        ToolListComponent,
        ToolViewComponent,
        ToolComponent
    ],
})
export class ToolModule { }
