import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../../components/material/material.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { SocketService } from '../../components/socket/socket.service';

import { StateListComponent } from './state-list/state-list.component';
import { StateService } from './state.service';

export const ROUTES: Routes = [{
    path: 'states',
    component: StateListComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES)
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
