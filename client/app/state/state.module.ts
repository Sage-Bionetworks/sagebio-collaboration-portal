import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../components/material/material.module';

import { RouterModule, Routes } from '@angular/router';

import { StateListComponent } from './state-list/state-list.component';

import { StateService } from './state.service';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'states', component: StateListComponent, data: {} }
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
        StateListComponent
    ],
    providers: [
        SocketService,
        StateService
    ],
    exports: [
        StateListComponent
    ],
})
export class StateModule { }
